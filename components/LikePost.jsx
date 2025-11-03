"use client";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import PeopleLiked from "./PeopleLiked";
import { likePost, dislikePost } from "@/lib/actions/post";
import { useState } from "react";
import { showToast } from "@/lib/utils/toast";
export default function LikePost({ postId, currentLikes, userId }) {
  const [likes, setLikes] = useState(currentLikes);
  const userHasLiked = likes.some((like) => like.id === userId);

  async function handleLike() {
    if (userHasLiked) {
      const response = await dislikePost(postId);
      if (response.success) {
        showToast("Disliked Post");
        setLikes((prev) => prev.filter((like) => like.id !== userId));
      } else {
        showToast("Failed to Dislike Post", "error");
      }
    } else {
      if (!userId) {
        showToast("Sign-in to Like Posts", "error");
        return;
      }
      const response = await likePost(postId);
      if (response.success) {
        showToast("Liked Post");
        setLikes((prev) => [...prev, { id: userId }]);
      } else {
        showToast("Failed to Like Post", "error");
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
        <PeopleLiked userHasLiked={userHasLiked} likes={likes} />
      )}
    </>
  );
}
