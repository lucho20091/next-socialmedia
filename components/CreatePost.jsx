"use client";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { createPost } from "@/lib/actions/post";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState("");
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef(null);
  function handleFileUpload(e) {
    const file = e.target.files[0];
    console.log(file);
    if (file && file.name.endsWith(".mp4")) {
      setIsVideo(true);
    }
    if (!file) return;
    if (file.size > 1024 * 1024 * 10) {
      toast.error("media size must be less than 10MB");
      setIsVideo(false);
      return;
    }
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setSelectedPreview(previewUrl);
  }

  function removeMedia() {
    setSelectedFile(null);
    setSelectedPreview(null);
    setIsVideo(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let mediaUrl;
      if (selectedFile) {
        const sigRes = await fetch("/api/signature");
        const { timestamp, signature } = await sigRes.json();
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", "uploads");
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
          }/${isVideo ? "video" : "image"}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) {
          toast.error("unable to add media");
        }
        const data = await response.json();
        mediaUrl = data.secure_url;
      }
      const result = await createPost(content.trim(), mediaUrl);

      if (result.success) {
        setContent("");
        setSelectedFile(null);
        setSelectedPreview(null);
        toast.success("created post successfully");
      } else {
        toast.error("failed to create post");
      }
    } catch (e) {
      toast.error("failed to create post");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex-1">
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="bg-gray-100 dark:bg-neutral-900 rounded-2xl p-4">
          <input
            type="text"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            placeholder="What's happening?"
            className="w-full bg-transparent text-gray-900 dark:text-gray-300 placeholder-gray-500 outline-none text-lg leading-relaxed py-3"
          />

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4">
              <label className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/video"
                  ref={fileInputRef}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={!content.trim() || isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-full text-sm transition-colors dark:disabled:bg-gray-400 dark:disabled:text-gray-600"
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </form>

      {selectedPreview && !isVideo && (
        <div className="relative mt-4 rounded-2xl overflow-hidden">
          <Image
            src={selectedPreview}
            alt="Selected"
            width={800}
            height={320}
            className="w-full md:w-[300px] h-auto object-contain"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      {selectedPreview && isVideo && (
        <div className="relative mt-4 rounded-2xl overflow-hidden">
          <video
            src={selectedPreview}
            className="w-full md:w-[300px] h-auto object-contain"
            controls
          />
          <button
            type="button"
            onClick={removeMedia}
            className="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
