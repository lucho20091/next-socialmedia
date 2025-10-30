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
export default function ProfileTabs({
  writtenPosts = [],
  likedPosts = [],
  userId = null,
}) {
  const [tab, setTab] = useState("posts");
  function formatDate(date) {
    const dateFns = formatDistanceToNow(date, { addSuffix: true });
    return dateFns.replace(/^about\s/, "");
  }
  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      className={[
        "py-2 cursor-pointer",
        tab === id
          ? "border-b-4 border-gray-400"
          : "hover:border-b-2 hover:border-gray-100",
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
      <div className="space-y-3">
        {items &&
          items.length > 0 &&
          items.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              {/* post header */}
              <div className="flex items-start space-x-3">
                {tab === "likes" ? (
                  <Link href={`/profile/${item.author.id}`}>
                    <Image
                      src={item.author.avatar || "/default-profile.jpg"}
                      width={40}
                      height={40}
                      alt={`${item.author.username} avatar`}
                      className="rounded-full border-2 border-blue-500 shadow-xl w-10 h-10"
                    />
                  </Link>
                ) : (
                  <Image
                    src={item.author.avatar || "/default-profile.jpg"}
                    width={40}
                    height={40}
                    alt={`${item.author.username} avatar`}
                    className="rounded-full border-2 border-blue-500 shadow-xl w-10 h-10"
                  />
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center space-x-2">
                    <Link href={`/profile/${item.author.id}`}>
                      <span className="font-bold text-gray-900">
                        {item.author.username}
                      </span>
                    </Link>
                    <span className="text-gray-500 text-xs sm:text-base">
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                </div>
                {item.author.id === userId && (
                  <div className="ml-auto flex gap-2">
                    <UpdatePostPage
                      id={item.id}
                      text={item.content}
                      imageUrl={item.author.avatar || "/default-profile.jpg"}
                      username={item.author.username}
                    />

                    <DeletePostPage id={item.id} />
                  </div>
                )}
              </div>
              {/* post content */}
              <div className="ml-13 mb-3 mt-[-16px]">
                <p className="text-gray-900 text-lg leading-relaxed">
                  {item.content}
                </p>
              </div>
              {/* post image */}
              {item.imageUrl && (
                <div className="ml-13 mb-3 rounded-2xl bg-black">
                  <Image
                    src={item.imageUrl}
                    width={500}
                    height={300}
                    alt={`Image posted by ${item.author.username}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
              {/* post actions */}
              <div className="ml-13 grid grid-cols-3">
                <div className="flex items-center justify-start gap-2 sm:gap-4 ">
                  <LikePost
                    postId={item.id}
                    currentLikes={item.likedBy}
                    userId={userId}
                  />
                </div>
                <div className="flex items-center justify-start gap-2 sm:gap-4 ">
                  <Link href={`/post/${item.id}`} className="cursor-pointer">
                    <CgComment size="20px" />
                  </Link>{" "}
                  <Link href={`/post/${item.id}`} className="">
                    <span>{item?.comments?.length} </span>
                    <span className="hidden sm:inline">
                      {item?.comments?.length === 1 ? "comment" : "comments"}
                    </span>
                  </Link>
                </div>
                <div className="flex items-center justify-end gap-4 ">
                  <SharePostPage id={item.id} />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-2">
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
