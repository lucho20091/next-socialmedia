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
  const avatarSrc =
    prismaUser?.avatar || user?.profileImageUrl || "/default-profile.jpg";
  const profileHref = prismaUser ? `/profile/${prismaUser.id}` : "/settings";
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md p-4">
      <nav className="flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="text-2xl font-bold">
          Social
          <span className="text-blue-500">Media</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link href={profileHref}>
              <Image
                src={avatarSrc}
                width={40}
                height={40}
                alt="Profile"
                className="rounded-full border-2 border-blue-500 shadow-xl"
              />
            </Link>

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
