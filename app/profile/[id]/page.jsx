import { stackServerApp } from "@/stack/server";
import { getUserByEmail, getFullUserById } from "@/lib/actions/user";
import { IoSettings } from "react-icons/io5";

import ProfileTabs from "@/components/ProfileTabs";
import Link from "next/link";
export default async function page({ params }) {
  const { id } = await params;
  const user = await stackServerApp.getUser();
  let prismaUser;
  if (user) {
    prismaUser = await getUserByEmail(user.primaryEmail);
  }
  const profileUser = await getFullUserById(id);
  return (
    <div className="min-h-[calc(100svh-100px)]">
      <div className="max-w-2xl mx-auto py-6 sm:py-8">
        <div
          className="
    flex items-start gap-4 
    p-6 sm:p-8 
    mx-4 sm:mx-6
    rounded-2xl 
    bg-white/90 dark:bg-neutral-900/90 
    border border-gray-200 dark:border-neutral-800 
    shadow-md shadow-black/30 dark:shadow-black/50 
    backdrop-blur-sm 
    transition-all duration-100 
    hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/10 
    hover:-translate-y-[2px]
  "
        >
          <img
            src={profileUser?.avatar || "/default-profile.jpg"}
            alt={
              profileUser?.username
                ? `${profileUser.username}'s profile avatar`
                : "Profile avatar"
            }
            className="
      w-20 h-20 sm:w-24 sm:h-24 
      rounded-full 
      border-2 border-indigo-500/70 
      object-cover 
      shadow-md shadow-black/40 
      hover:scale-105 transition-transform duration-300
    "
          />
          <div className="flex-1 min-w-0">
            <h1
              className="
        text-2xl font-semibold sm:text-3xl 
        text-gray-900 dark:text-gray-200 
        truncate
      "
            >
              {profileUser?.username || "User"}
            </h1>

            <div
              className="
        mt-3 flex flex-wrap gap-4 
        text-sm sm:text-base 
        text-gray-600 dark:text-gray-400
      "
            >
              <span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {profileUser?.writtenPosts?.length ?? 0}
                </span>{" "}
                posts
              </span>
              <span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {profileUser?.likedPosts?.length ?? 0}
                </span>{" "}
                likes
              </span>
            </div>
          </div>
          <div>
            {prismaUser && profileUser.id === prismaUser.id && (
              <Link
                href="/settings"
                className="
    w-10 h-10 sm:w-10 sm:h-10 
    grid place-items-center 
    rounded-full 
    cursor-pointer 
    transition-all duration-300 
    bg-gray-100 dark:bg-neutral-900 
    border border-gray-400 dark:border-neutral-700 
    text-gray-800 dark:text-gray-300 
    shadow-md shadow-black/40 
    hover:scale-105 
    hover:shadow-lg 
    hover:border-indigo-500/60 dark:hover:border-indigo-400/60 
    hover:text-indigo-500 dark:hover:text-indigo-300
  "
                aria-label="Go to settings"
              >
                <IoSettings size={20} className="text-inherit" />
              </Link>
            )}
          </div>
        </div>
        <ProfileTabs
          writtenPosts={profileUser.writtenPosts}
          likedPosts={profileUser.likedPosts}
          user={prismaUser ? prismaUser : ""}
        />
      </div>
    </div>
  );
}