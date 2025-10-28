import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";
export async function GET(request) {
  const user = await stackServerApp.getUser();
  try {
    if (user) {
      const firstUser = await prisma.user.create({
        data: {
          username: "lucho20091",
          email: "darkness_20_09@gmail.com",
        },
      });
      console.log(firstUser);
      return NextResponse.json({
        message: "user created successfully",
        firstUser,
      });
    } else {
      return NextResponse.json({ message: "please log in" });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "server error" });
  }
}
