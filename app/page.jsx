import Image from "next/image";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CreatePost from "@/components/CreatePost";
import { readMainPosts } from "@/lib/actions/post";

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

  const prismaUser = await handleUserPrisma();
  const getAllPosts = await readMainPosts();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {prismaUser && (
        <div className="flex justify-center items-start border-b border-gray-200">
          <div className="w-full max-w-2xl">
            <div className="flex items-center p-4 space-x-3">
              {prismaUser?.avatar && (
                <Image
                  src={prismaUser.avatar}
                  width={40}
                  height={40}
                  alt="Profile"
                  className="rounded-full"
                />
              )}
              <CreatePost />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {getAllPosts.length > 0 &&
          getAllPosts.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Post Header */}
              <div className="flex items-center space-x-3 mb-3">
                {item.author.avatar ? (
                  <Image
                    src={item.author.avatar}
                    width={40}
                    height={40}
                    alt={`${item.author.username} avatar`}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm">
                      {item.author.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">
                      {item.author.username}
                    </span>
                    <span className="text-gray-500 text-sm">2h</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="ml-13 mb-3">
                <p className="text-gray-900 text-lg leading-relaxed">
                  {item.content}
                </p>
              </div>

              {/* Post Image */}
              {item.imageUrl && (
                <div className="ml-13 mb-3 rounded-2xl overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    width={500}
                    height={300}
                    alt={`Image posted by ${item.author.username}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="ml-13 flex items-center justify-between max-w-md">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-sm">12</span>
                </button>

                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-sm">24</span>
                </button>

                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
              </div>

              {/* Comments Section */}
              <div className="ml-13 mt-4 space-y-3">
                {/* Last 2 Comments */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 font-semibold text-xs">
                        U
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          user1
                        </span>
                        <span className="text-gray-500 text-xs">1h</span>
                      </div>
                      <p className="text-gray-700 text-sm mt-1">
                        Great post! Love this content.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 font-semibold text-xs">
                        U
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          user2
                        </span>
                        <span className="text-gray-500 text-xs">30m</span>
                      </div>
                      <p className="text-gray-700 text-sm mt-1">
                        Amazing! Thanks for sharing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comment Form */}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-start space-x-3">
                    {prismaUser?.avatar ? (
                      <Image
                        src={prismaUser.avatar}
                        width={32}
                        height={32}
                        alt="Your avatar"
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-xs">
                          {prismaUser?.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm"
                          />
                          <button className="text-gray-500 hover:text-gray-700 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-xs">Image</span>
                          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded-full text-xs transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
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
