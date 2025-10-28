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
          comments: true,
        },
      });
      console.log(existingUser);
      const updateComment = await prisma.comment.update({
        where: {
          id: existingUser.comments[0].id,
        },
        data: {
          content: "this is my first comment edited lmao",
        },
      });
      return NextResponse.json({
        message: "post updated successfully",
        updateComment,
      });
    } else {
      return NextResponse.json({ message: "please log in" });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "server error" });
  }
}
