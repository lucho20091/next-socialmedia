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
  console.log(profileUser);
  return (
    <div className="min-h-[calc(100svh-100px)]">
      <div className="max-w-3xl mx-auto py-4 sm:p-6">
        <div className="bg-white rounded-xl mx-4 shadow-md p-6 flex items-start gap-4 dark:bg-neutral-900 shadow-md dark:shadow-gray-800">
          <img
            src={profileUser?.avatar || "/default-profile.jpg"}
            alt={
              profileUser?.username
                ? `${profileUser.username} avatar`
                : "Profile avatar"
            }
            className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover shadow"
          />
          <div className="flex-1  min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 truncate dark:text-gray-400">
              {profileUser?.username || "User"}
            </h1>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-500">
              <span>
                <span className="font-semibold">
                  {profileUser?.writtenPosts?.length ?? 0}
                </span>{" "}
                posts
              </span>
              <span>
                <span className="font-semibold">
                  {profileUser?.likedPosts?.length ?? 0}
                </span>{" "}
                likes
              </span>
            </div>
          </div>
          <div>
            {prismaUser && profileUser.id === prismaUser.id && (
              <Link href="/settings">
                <IoSettings size="40px" className="dark:text-gray-400" />
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
