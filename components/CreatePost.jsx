"use client";
import { useState } from "react";
import toast from "react-hot-toast";
export default function CreatePost() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState("");
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 5) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    setSelectedFile(file);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const sigRes = await fetch("/api/signature");
      const { timestamp, signature } = await sigRes.json();
      console.log(timestamp, signature);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", "uploads");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        console.log("error");
      }
      const data = await response.json();
      const imageUrl = data.secure_url;
      console.log(imageUrl);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={(e) => setContent(e.target.value)}
        value={content}
      />
      <input type="file" onChange={handleFileUpload} />
      <button>submit</button>
    </form>
  );
}
