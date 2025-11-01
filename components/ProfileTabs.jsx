"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CgComment } from "react-icons/cg";
import SharePostPage from "@/components/SharePost";
import LikePost from "@/components/LikePost";
import UpdatePostPage from "@/components/updatePost";
import DeletePostPage from "@/components/DeletePost";
import PostPage from "./Post";
export default function ProfileTabs({
  writtenPosts = [],
  likedPosts = [],
  user = null,
}) {
  const [tab, setTab] = useState("posts");
  function formatDate(date) {
    const dateFns = formatDistanceToNow(date, { addSuffix: true });
    return dateFns.replace(/^about\s/, "");
  }
  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      data-aos="zoom-in"
      data-aos-duration="500"
      suppressHydrationWarning
      className={[
        "py-2 cursor-pointer",
        tab === id
          ? "border-b-4 border-gray-400 dark:border-gray-800"
          : "hover:border-b-2 hover:border-gray-100 dark:hover:border-gray-700",
      ].join(" ")}
      type="button"
    >
      {label}
    </button>
  );

  const List = ({ items, emptyLabel }) => {
    if (!items?.length) {
      return <div className="text-center text-gray-500">{emptyLabel}</div>;
    }
    return (
      <div>
        {items &&
          items.length > 0 &&
          items.map((item) => (
            <PostPage
              key={item.id}
              post={item}
              prismaUser={user}
              displayComments={false}
            />
          ))}
      </div>
    );
  };

  return (
    <div className="py-4 sm:p-6">
      <div className="grid grid-cols-2 gap-2 mx-4 dark:text-gray-400">
        <TabButton id="posts" label="Posts" />
        <TabButton id="likes" label="Likes" />
      </div>

      <div className="mt-4">
        {tab === "posts" ? (
          <List items={writtenPosts} emptyLabel="No posts yet." />
        ) : (
          <List items={likedPosts} emptyLabel="No likes yet." />
        )}
      </div>
    </div>
  );
}
