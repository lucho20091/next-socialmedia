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
      const createLike = await prisma.post.update({
        where: {
          id: existingUser.writtenPosts[0].id,
        },
        data: {
          likedBy: {
            connect: { id: existingUser.id },
          },
        },
        include: {
          likedBy: true,
        },
      });
      console.log(existingUser);
      return NextResponse.json({
        message: "liked created successfully",
        createLike,
      });
    } else {
      return NextResponse.json({ message: "please log in" });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "server error" });
  }
}
