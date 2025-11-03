import Image from "next/image";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";
import CreatePost from "@/components/CreatePost";
import { readMainPosts } from "@/lib/actions/post";
import PostPage from "@/components/Post";

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
    <div className="min-h-[calc(100svh-100px)]" suppressHydrationWarning>
      {prismaUser && (
        <div className="flex justify-center items-start overflow-hidden">
          <div className="w-full max-w-2xl">
            <div className="flex items-start px-4 py-6 sm:py-8 gap-2">
              <Image
                src={prismaUser.avatar || "/default-profile.jpg"}
                alt="Profile"
                width={40}
                height={40}
                className="object-cover rounded-full border-2 border-gray-800 w-10 h-10 shadow-xl dark:shadow-gray-900"
              />

              <CreatePost isAdmin={prismaUser.isAdmin} />
            </div>
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        {getAllPosts &&
          getAllPosts.length > 0 &&
          getAllPosts.map((item, index) => (
            <PostPage
              key={item.id}
              post={item}
              prismaUser={prismaUser}
              homePage={true}
              index={index}
            />
          ))}
      </div>
    </div>
  );
}
