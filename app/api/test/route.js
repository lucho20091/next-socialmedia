import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
export async function GET(request) {
  const user = await stackServerApp.getUser();
  try {
    console.log(request);
    if (user) {
      return NextResponse.json({ message: "api call successfully" });
    } else {
      return NextResponse.json({ message: "please log in" });
    }
  } catch (e) {
    console.log(e);
  }
}
