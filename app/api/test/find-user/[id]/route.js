import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";
export async function GET(request, { params }) {
  const user = await stackServerApp.getUser();
  const { id } = await params;
  try {
    if (user) {
      const existingUser = await prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          writtenPosts: true,
          likedPosts: true,
          comments: true,
        },
      });

      return NextResponse.json({
        message: "user founded successfully",
        existingUser,
      });
    } else {
      return NextResponse.json({ message: "please log in" });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "server error" });
  }
}
