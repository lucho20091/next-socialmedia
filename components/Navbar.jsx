import Link from "next/link";
import { UserButton } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";

export default async function Navbar() {
  const user = await stackServerApp.getUser();

  return (
    <nav className="p-4 flex items-center justify-between">
      <Link href="/">Home</Link>

      {user ? (
        <>
          <Link href="/test">test</Link>
          <UserButton />
        </>
      ) : (
        <Link href="/sign-in">Sign In</Link>
      )}
    </nav>
  );
}
