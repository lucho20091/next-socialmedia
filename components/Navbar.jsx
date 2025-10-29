import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { getUserByEmail } from "@/lib/actions/user";
import Image from "next/image";
import LogoutButton from "./LogOut";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const user = await stackServerApp.getUser();
  let prismaUser;
  if (user) {
    prismaUser = await getUserByEmail(user?.primaryEmail);
  }
  return (
    <header className="p-4">
      <nav className="sticky top-0 z-10 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          SocialMedia
        </Link>
        {user ? (
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center justify-center">
              <Link href={`/profile/${prismaUser.id}`}>
                <Image
                  src={prismaUser.avatar || "/default-profile.jpg"}
                  width={40}
                  height={40}
                  alt="Profile"
                  className="rounded-full border-2 border-blue-500 shadow-xl"
                />
              </Link>
            </div>
            <LogoutButton />
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="cursor-pointer">Sign In</Button>
          </Link>
        )}
      </nav>
    </header>
  );
}

{
  /* <Link href="/">Home</Link>

{user ? (
  <>
    <Link href="/test">test</Link>
    <UserButton />
  </>
) : (
  <Link href="/sign-in">Sign In</Link>
)} */
}
