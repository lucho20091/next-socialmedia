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
        toast("Disliked Post", {
          style: { background: "#333", color: "#fff" },
        });
        setLikes((prev) => prev.filter((like) => like.id !== userId));
      } else {
        toast.error("Failed to Dislike Post", {
          style: { background: "#333", color: "#fff" },
        });
      }
    } else {
      if (!userId) {
        toast.error("Sign-in to Like Posts", {
          style: { background: "#333", color: "#fff" },
        });
        return;
      }
      const response = await likePost(postId);
      if (response.success) {
        toast("Liked Post", {
          style: { background: "#333", color: "#fff" },
        });
        setLikes((prev) => [...prev, { id: userId }]);
      } else {
        toast.error("Failed to Like Post", {
          style: { background: "#333", color: "#fff" },
        });
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
