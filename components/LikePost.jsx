"use client";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";

import { likePost, dislikePost } from "@/lib/actions/post";
import { useState } from "react";
import toast from "react-hot-toast";
export default function LikePost({ postId, currentLikes, userId }) {
  const [likes, setLikes] = useState(currentLikes);
  const userHasLiked = likes.some((like) => like.id === userId);

  async function handleLike() {
    if (userHasLiked) {
      const response = await dislikePost(postId);
      if (response.success) {
        toast.success("disliked post successfully");
        setLikes((prev) => prev.filter((like) => like.id !== userId));
      } else {
        toast.error("failed to dislike post");
      }
    } else {
      if (!userId) {
        toast.error("you must sign in to like posts");
        return;
      }
      const response = await likePost(postId);
      if (response.success) {
        toast.success("liked post successfully");
        setLikes((prev) => [...prev, { id: userId }]);
      } else {
        toast.error("failed to like post");
      }
    }
  }
  return (
    <>
      <button className="cursor-pointer" onClick={handleLike}>
        {userHasLiked ? (
          <BiSolidLike
            size="25px"
            className="text-blue-500 dark:text-blue-800"
          />
        ) : (
          <BiLike size="25px" className="dark:text-gray-400" />
        )}
      </button>
      {likes.length > 0 && (
        <span
          onClick={handleLike}
          className={`cursor-pointer select-none
            ${
              userHasLiked
                ? "text-blue-500 dark:text-blue-800 font-semibold"
                : "text-gray-500 dark:text-gray-400"
            }
          `}
        >
          {likes.length} {likes.length === 1 ? "like" : "likes"}
        </span>
      )}
    </>
  );
}
