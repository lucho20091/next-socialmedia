import { NextResponse } from "next/server";
export async function GET(req) {
  try {
    const info = req.headers.get("x-forwarded-for") ?? "unknown";
    const token = process.env.IP_INFO_TOKEN;
    const res = await fetch(
      `https://api.ipinfo.io/lite/${info}?token=${token}`
    );

    const { country, continent } = await res.json();
    return NextResponse.json({ country, continent });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
