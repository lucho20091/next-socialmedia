import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";
export async function GET(request, { params }) {
  const user = await stackServerApp.getUser();
  const { id } = await params;
  try {
    if (user) {
      const findPost = await prisma.post.findUnique({
        where: {
          id: id,
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
