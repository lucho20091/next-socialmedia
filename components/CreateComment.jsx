"use client";
import { createComment } from "@/lib/actions/comment";
import { useState } from "react";
import toast from "react-hot-toast";
export default function CommentPage({ postId }) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await createComment(content, postId);
      if (result.success) {
        setContent("");
        toast.success("comment created successfully");
      }
    } catch (e) {
      toast.error("failed to create post");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <form
      className="flex flex-wrap items-center space-x-2 mb-2"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Add a comment..."
        className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none min-w-[150px] dark:text-gray-300"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-full text-sm transition-colors ml-auto"
      >
        {isLoading ? "Replying..." : "Reply"}
      </button>
    </form>
  );
}
