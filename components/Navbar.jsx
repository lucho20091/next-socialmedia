import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { getUserByEmail } from "@/lib/actions/user";
import Image from "next/image";
import LogoutButton from "./LogOut";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { FaRegEyeSlash } from "react-icons/fa6";
import HasSeenPopUp from "./HasSeenPopUp";

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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md p-4">
      <nav className="flex items-center justify-between max-w-6xl mx-auto">
        <Link
          href="/"
          className="group text-2xl font-bold dark:text-gray-300 tracking-tighter"
        >
          <span className="transition-colors dark:group-hover:text-gray-200 font-bold">
            S
          </span>
          <span
            className="text-blue-500 dark:text-blue-800 font-bold transition-colors dark:group-hover:text-blue-500 
"
          >
            Media
          </span>
        </Link>
        <div className="flex items-center justify-center gap-2  sm:gap-4">
          <HasSeenPopUp />
          {prismaUser && prismaUser.isAdmin && (
            <div className="flex gap-2 sm:gap-4">
              <Link
                href="/hidden"
                className="
    w-10 h-10 
    grid place-items-center 
    rounded-full 
    cursor-pointer
    transition-all duration-300 
    bg-gray-100 dark:bg-neutral-900 
    border border-gray-400 dark:border-neutral-700 
    text-gray-800 dark:text-gray-300
    shadow-md shadow-black/40 
    hover:scale-105 hover:shadow-lg 
    hover:border-indigo-500/60 
    dark:hover:border-indigo-400/60 
    hover:text-indigo-400
  "
              >
                <FaRegEyeSlash className="text-inherit" />
              </Link>
            </div>
          )}
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href={profileHref}>
                <Image
                  src={avatarSrc}
                  width={40}
                  height={40}
                  alt="Profile"
                  className="      
       w-10 h-10 
      rounded-full 
      cursor-pointer
      transition-all duration-300 
      bg-gray-100 dark:bg-neutral-900 
      border-2 border-gray-400 dark:border-blue-800 
      shadow-md shadow-black/40 
      hover:scale-105 hover:shadow-lg 
      hover:border-indigo-500/60 
      dark:hover:border-blue-400
      "
                />
              </Link>

              <LogoutButton />
            </div>
          ) : (
            <Link href="/sign-in">
              <Button
                className="
              h-10
      cursor-pointer 
      px-5 py-2 
      rounded-xl 
      font-medium 
      text-white 
      bg-blue-500 
      hover:bg-indigo-500 
      dark:bg-blue-800 
      dark:hover:bg-indigo-600 
      transition-all duration-200 
      shadow-md hover:shadow-lg 
      hover:scale-[1.03]
    "
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}