// components/SettingsForm.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { updateUser } from "@/lib/actions/user";

export default function SettingsForm({
  userId,
  initialUsername,
  initialAvatar,
}) {
  const [username, setUsername] = useState(initialUsername ?? "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(
    initialAvatar ?? "/default-profile.jpg"
  );
  const [isSaving, setIsSaving] = useState(false);

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function uploadToCloudinary(file) {
    const sigRes = await fetch("/api/signature");
    if (!sigRes.ok) throw new Error("Failed to get upload signature");
    const { timestamp, signature } = await sigRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", "uploads");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      let avatarUrl = initialAvatar;
      if (selectedFile) {
        avatarUrl = await uploadToCloudinary(selectedFile);
      }
      const res = await updateUser(userId, {
        username: username?.trim() || undefined,
        avatar: avatarUrl || undefined,
      });
      if (!res) {
        toast.error("Failed to update profile");
        return;
      }
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Could not save settings");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-start gap-4">
        <Image
          src={preview || "/default-profile.jpg"}
          alt="Avatar preview"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow"
        />
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Avatar
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 text-sm">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7h2l2-3h6l2 3h2a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 13l4-4a2 2 0 012 0l3 3m0 0l2-2a2 2 0 012 0l3 3M13 16h.01"
                />
              </svg>
              <span>Choose image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-500">JPG/PNG, up to 5MB.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          maxLength={20}
          className="mt-2 w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
