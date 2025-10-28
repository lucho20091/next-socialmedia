import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";
export async function GET(request) {
  const user = await stackServerApp.getUser();
  try {
    if (user) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.primaryEmail,
        },
      });
      const allPosts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          author: true,
          likedBy: true,
          comments: true,
        },
      });
      return NextResponse.json({
        message: "posts readed successfully",
        allPosts,
      });
    } else {
      return NextResponse.json({ message: "please log in" });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "server error" });
  }
}
