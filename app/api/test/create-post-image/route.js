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
      const response = await fetch("http://localhost:3000/api/signature");
      const data = await response.json();
      console.log(data);
      return NextResponse.json({ message: "it worked so far" });
    } else {
      return NextResponse.json({ message: "please log in" });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "server error" });
  }
}
