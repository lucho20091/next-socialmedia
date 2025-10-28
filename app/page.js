import Image from "next/image";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

  console.log(user);
  return (
    <div>
      <p>home</p>
      {prismaUser && prismaUser?.avatar && (
        <>
          <Image
            src={prismaUser?.avatar}
            alt="User avatar"
            width={100}
            height={100}
            className="rounded-full"
          />
        </>
      )}
    </div>
  );
}
