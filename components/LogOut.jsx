"use client";

import { stackClientApp } from "@/stack/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaSignOutAlt } from "react-icons/fa";

import { useState } from "react";
export default function LogoutButton() {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await stackClientApp.signOut();
    // optional redirect
    window.location.href = "/";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="
    cursor-pointer 
    flex items-center justify-center gap-2 
    rounded-full sm:rounded-xl 
    w-10 h-10 sm:w-auto sm:px-4 
    transition-all duration-300 
    bg-gray-100 dark:bg-neutral-900 
    border border-gray-400 dark:border-neutral-700 
    text-gray-800 dark:text-gray-400 
    shadow-md shadow-black/40 
    hover:scale-105 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-neutral-900
    hover:border-red-400/60 dark:hover:border-red-400/60 
    hover:text-red-400 dark:hover:text-red-400
  "
          suppressHydrationWarning
        >
          <span className="hidden sm:inline">Log out</span>
          <div className="sm:hidden">
            <FaSignOutAlt size="20px" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-[300px] sm:w-[300px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>You will Log out.</DialogDescription>
        </DialogHeader>

        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={() => handleLogout()}
        >
          Log Out
        </Button>
      </DialogContent>
    </Dialog>
  );
}
