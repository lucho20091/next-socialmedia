import Image from "next/image";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CreatePost from "@/components/CreatePost";
import { readMainPosts } from "@/lib/actions/post";
import { getUserAvatarById } from "@/lib/actions/user";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { BiLike } from "react-icons/bi";
import { CgComment } from "react-icons/cg";
import { CiShare2 } from "react-icons/ci";
import CreateComment from "@/components/CreateComment";

import UpdatePostPage from "@/components/updatePost";
import DeletePostPage from "@/components/DeletePost";

export default async function Home() {
  const user = await stackServerApp.getUser();

  async function handleUserPrisma() {
    // if no user return null
    if (!user) return null;
    try {
      // check if user exists in prisma
      const existingUser = await prisma.user.findUnique({
        where: { email: user.primaryEmail },
      });
      // if user exist then just return it
      if (existingUser) return existingUser;
      // else return the new user created
      return await prisma.user.create({
        data: {
          email: user.primaryEmail,
          username: user.displayName || user.primaryEmail,
          avatar: user.profileImageUrl || null,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  function formatDate(date) {
    const dateFns = formatDistanceToNow(date, { addSuffix: true });
    return dateFns.replace(/^about\s/, "");
  }
  const prismaUser = await handleUserPrisma();
  const getAllPosts = await readMainPosts();

  console.log(getAllPosts);
  async function createCommentForm(formData) {
    const content = formData.get("content");
    const response = await createComment(content);
  }
  return (
    <div className="min-h-screen">
      {prismaUser && (
        <div className="flex justify-center items-start">
          <div className="w-full max-w-2xl">
            <div className="flex items-start p-4 space-x-3">
              <Image
                src={prismaUser.avatar || "/default-profile.jpg"}
                width={40}
                height={40}
                alt="Profile"
                className="rounded-full border-2 border-blue-500 shadow-xl"
              />
              <CreatePost />
            </div>
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        {getAllPosts &&
          getAllPosts.length > 0 &&
          getAllPosts.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              {/* post header */}
              <div className="flex items-start space-x-3">
                <Link href={`/profile/${item.author.id}`}>
                  <Image
                    src={item.author.avatar || "/default-profile.jpg"}
                    width={40}
                    height={40}
                    alt={`${item.author.username} avatar`}
                    className="rounded-full border-2 border-blue-500 shadow-xl"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Link href={`/profile/${item.author.id}`}>
                      <span className="font-bold text-gray-900">
                        {item.author.username}
                      </span>
                    </Link>
                    <span className="text-gray-500">
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                </div>
                {item.author.id === prismaUser.id && (
                  <div className="ml-auto flex gap-2">
                    <UpdatePostPage
                      id={item.id}
                      text={item.content}
                      imageUrl={prismaUser.avatar || "/default-profile.jpg"}
                      username={prismaUser.username}
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
                <div className="flex items-center justify-start gap-4 ">
                  <button className="cursor-pointer border-1 border-black">
                    <BiLike size="20px" />
                  </button>
                  {item.likedBy.length > 0 && (
                    <span>
                      {item.likedBy.length}{" "}
                      {item.likedBy.length === 1 ? "like" : "likes"}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-start gap-4 ">
                  <Link
                    href={`/post/${item.id}`}
                    className="cursor-pointer border-1 border-black"
                  >
                    <CgComment size="20px" />
                  </Link>{" "}
                  <Link href={`/post/${item.id}`}>
                    {item.comments.length}{" "}
                    {item.comments.length === 1 ? "comment" : "comments"}
                  </Link>
                </div>
                <div className="flex items-center justify-end gap-4 ">
                  <button className="cursor-pointer border-1 border-black">
                    <CiShare2 size="20px" />
                  </button>{" "}
                  <span>Share</span>
                </div>
              </div>
              {/* comment section */}
              <div className="ml-13 mt-4 space-y-3">
                {item.comments.length > 0 &&
                  item.comments.map((item) => (
                    <div key={item.id}>
                      <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-100">
                        <Link href={`/profile/${item.author.id}`}>
                          <Image
                            src={item.author.avatar || "/default-profile.jpg"}
                            width={40}
                            height={40}
                            alt="Profile"
                            className="rounded-full border-2 border-blue-500 shadow-xl"
                          />
                        </Link>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/profile/${item.author.id}`}
                              className="font-semibold text-gray-900"
                            >
                              {item.author.username}
                            </Link>
                            <span className="text-gray-500">
                              {formatDate(item.updatedAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1">{item.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {/* comment form */}
              <div className="pt-3">
                <div className="flex items-start space-x-3">
                  <Image
                    src={prismaUser.avatar || "/default-profile.jpg"}
                    width={40}
                    height={40}
                    alt={`${prismaUser.username} avatar`}
                    className="rounded-full border-2 border-blue-500 shadow-xl"
                  />

                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-md p-3">
                      <CreateComment postId={item.id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
