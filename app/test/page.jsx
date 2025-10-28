"use client";
import { useState } from "react";

export default function page() {
  const [selectedFile, setSelectedFile] = useState(null);
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
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
    <div className="px-4">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileUpload} />
        <button>submit</button>
      </form>
    </div>
  );
}
