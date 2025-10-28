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
        include: {
          writtenPosts: true,
        },
      });
      const findPost = await prisma.post.findUnique({
        where: {
          id: existingUser.writtenPosts[0].id,
        },
      });
      return NextResponse.json({
        message: "post founded successfully",
        findPost,
      });
    } else {
      return NextResponse.json({ message: "please log in" });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "server error" });
  }
}
