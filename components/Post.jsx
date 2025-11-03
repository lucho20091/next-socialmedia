"use client";
import { useEffect } from "react";
import AOS from "aos";
import Image from "next/image";
import Link from "next/link";
import { CgComment } from "react-icons/cg";

import SharePostPage from "@/components/SharePost";
import CreateComment from "@/components/CreateComment";
import DeleteCommentPage from "@/components/DeleteComment";
import UpdateCommentPage from "@/components/UpdateComment";
import LikePost from "@/components/LikePost";

import UpdatePostPage from "@/components/updatePost";
import DeletePostPage from "@/components/DeletePost";
import HidePostPage from "./HidePost";
import { formatDistanceToNow } from "date-fns";

import LockScreen from "./LockScreen";
import ProtectPostPage from "./ProtectPost";
export default function PostPage({
  post,
  prismaUser,
  displayComments = true,
  homePage = false,
  index = 1,
}) {
  function formatDate(date) {
    const dateFns = formatDistanceToNow(date, { addSuffix: true });
    return dateFns.replace(/^about\s/, "");
  }
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      easing: "ease-out-cubic",
      mirror: true,
      disable: () => window.innerWidth < 1300,
    });
  }, []);

  const delay = index > 10 ? 1000 : index * 100;
  const duration = index < 3 ? 500 + index * 200 : 1100;

  return (
    <div
      key={post.id}
      className="border-y border-gray-200 dark:border-gray-800 px-4 py-6 hover:bg-gray-50 dark:hover:bg-[oklch(16.5%_0_0)] transition-colors"
      data-aos="zoom-in-left"
      data-aos-delay={delay}
      data-aos-duration={duration}
      suppressHydrationWarning
    >
      {/* post header */}
      <div className="flex items-start space-x-3">
        <Link href={`/profile/${post.author.id}`}>
          <Image
            src={post.author.avatar || "/default-profile.jpg"}
            width={40}
            height={40}
            alt={`${post.author.username} avatar`}
            className=" w-10 h-10 
      rounded-full 
      cursor-pointer
      transition-all duration-300 
      bg-gray-100 dark:bg-neutral-900 
      border border-gray-400 dark:border-neutral-700 
      shadow-md shadow-black/40 
      hover:scale-105 hover:shadow-lg 
      hover:border-indigo-500/60 
      dark:hover:border-indigo-400/60"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col items-start sm:flex-row sm:items-center space-x-2 min-w-0">
            <Link
              href={`/profile/${post.author.id}`}
              className="min-w-0 max-w-full"
            >
              <span className="block font-bold text-gray-900 dark:text-gray-400 truncate">
                {post.author.username}
              </span>
            </Link>
            <span className="text-gray-500 text-xs sm:text-base">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {prismaUser &&
            prismaUser.isAdmin &&
            post.author.id === prismaUser.id && (
              <ProtectPostPage id={post.id} isProtected={post.isProtected} />
            )}
          {prismaUser &&
            (prismaUser?.isAdmin || post.author.id === prismaUser.id) && (
              <HidePostPage id={post.id} />
            )}
          {prismaUser &&
            (post.author.id === prismaUser.id ||
              prismaUser.isAdmin === true) && (
              <>
                <UpdatePostPage
                  id={post.id}
                  text={post.content}
                  imageUrl={prismaUser.avatar || "/default-profile.jpg"}
                  username={prismaUser.username}
                  isAdmin={prismaUser.isAdmin}
                />

                <DeletePostPage id={post.id} />
              </>
            )}
        </div>
      </div>
      {/* post content */}
      <div className="ml-13 mb-3 mt-0 sm:mt-[-16px]">
        <p className="text-gray-900 dark:text-gray-300 text-lg leading-tight">
          {post.content}
        </p>
      </div>
      {/* post image */}
      {post.mediaUrl && !post.mediaUrl.endsWith(".mp4") && (
        <div className="sm:ml-13 mb-4 rounded-2xl bg-black">
          <Image
            src={post.mediaUrl}
            width={500}
            height={500}
            alt={`Image posted by ${post.author.username}`}
            className="w-full h-auto object-contain"
          />
        </div>
      )}
      {/* post video */}
      {post.mediaUrl && post.mediaUrl.endsWith(".mp4") && (
        <div className="sm:ml-13 mb-4 rounded-2xl bg-black relative">
          <video
            src={post.mediaUrl}
            className="w-full h-auto max-h-[600px] object-contain"
            controls
            loop
          />
          <LockScreen />
        </div>
      )}
      {/* post actions */}
      <div className="grid grid-cols-[2fr_2fr_1fr] sm:grid-cols-3 sm:ml-13">
        <div className="flex items-center justify-start gap-2 sm:gap-4 ">
          <LikePost
            postId={post.id}
            currentLikes={post.likedBy}
            userId={prismaUser?.id || null}
          />
        </div>
        <Link
          href={`/post/${post.id}`}
          className="flex items-center justify-start gap-2 sm:gap-4 dark:text-gray-400"
        >
          <CgComment size="25px" />{" "}
          <span>{post?._count?.comments || post?.comments?.length} </span>
          <span className="hidden sm:inline">
            {post?._count?.comments === 1 || post?.comments?.length === 1
              ? "comment"
              : "comments"}
          </span>
        </Link>
        <div className="flex items-center justify-end gap-4 ">
          <SharePostPage id={post.id} />
        </div>
      </div>
      {displayComments && (
        <>
          {/* comment section */}
          <div className="sm:ml-13 mt-4">
            {homePage && post._count.comments > 2 && (
              <Link
                className="inline-block text-blue-800 font-semibold mb-2"
                href={`/post/${post.id}`}
              >
                View more comments
              </Link>
            )}
            {post.comments.length > 0 &&
              post.comments.map((item) => (
                <div key={item.id}>
                  <div className="flex items-start space-x-3 pl-4 py-2 border-y-1 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-neutral-950">
                    <Link href={`/profile/${item.author.id}`}>
                      <Image
                        src={item.author.avatar || "/default-profile.jpg"}
                        width={40}
                        height={40}
                        alt="Profile"
                        className="w-10 h-10 
      rounded-full 
      cursor-pointer
      transition-all duration-300 
      bg-gray-100 dark:bg-neutral-900 
      border border-gray-400 dark:border-neutral-700 
      shadow-md shadow-black/40 
      hover:scale-105 hover:shadow-lg 
      hover:border-indigo-500/60 
      dark:hover:border-indigo-400/60"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex flex-col items-start sm:flex-row sm:items-center space-x-2">
                        <Link
                          href={`/profile/${item.author.id}`}
                          className="font-semibold text-gray-900 dark:text-gray-400"
                        >
                          {item.author.username}
                        </Link>
                        <span className="text-gray-500 text-xs sm:text-base">
                          {formatDate(item.updatedAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-tight dark:text-gray-300">
                        {item.content}
                      </p>
                    </div>
                    {prismaUser &&
                      (item.author.id === prismaUser.id ||
                        prismaUser.isAdmin) && (
                        <div className="ml-auto flex gap-2">
                          <UpdateCommentPage
                            id={item.id}
                            text={item.content}
                            imageUrl={
                              prismaUser.avatar || "/default-profile.jpg"
                            }
                            username={prismaUser.username}
                            isAdmin={prismaUser.isAdmin}
                          />
                          <DeleteCommentPage commentId={item.id} />
                        </div>
                      )}
                  </div>
                </div>
              ))}
          </div>
          {/* comment form */}
          {prismaUser && (
            <>
              <div className="pt-4">
                <div className="flex items-start space-x-3">
                  <Image
                    src={prismaUser?.avatar || "/default-profile.jpg"}
                    width={40}
                    height={40}
                    alt={`${prismaUser.username} avatar`}
                    className="rounded-full border-2 border-gray-800 shadow-xl dark:shadow-gray-900 w-10 h-10"
                  />

                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-neutral-900 rounded-md p-3 shadow-md dark:shadow-gray-900">
                      <CreateComment postId={post.id} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
