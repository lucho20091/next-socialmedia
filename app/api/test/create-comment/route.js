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
      const createComment = await prisma.comment.create({
        data: {
          content: "this is the best comment",
          authorId: existingUser.id,
          postId: existingUser.writtenPosts[0].id,
        },
      });
      console.log(existingUser);
      return NextResponse.json({
        message: "comment created successfully",
        createComment,
      });
    } else {
      return NextResponse.json({ message: "please log in" });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "server error" });
  }
}
