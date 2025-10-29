"use client";
import { createComment } from "@/lib/actions/comment";
import { useState } from "react";
import toast from "react-hot-toast";
export default function CommentPage({ postId }) {
  const [content, setContent] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await createComment(content, postId);
      if (result.success) {
        setContent("");
        toast.success("comment created successfully");
      }
    } catch (e) {
      console.log(e);
      toast.error("failed to create post");
    }
  }
  return (
    <form className="flex items-center space-x-2 mb-2" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a comment..."
        className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded-sm transition-colors">
        Reply
      </button>
    </form>
  );
}
