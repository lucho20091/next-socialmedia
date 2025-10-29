import { SignIn } from "@stackframe/stack";
import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await stackServerApp.getUser();
  if (user) {
    redirect("/test");
  }
  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center">
      <div>
        <SignIn />
      </div>
    </div>
  );
}
