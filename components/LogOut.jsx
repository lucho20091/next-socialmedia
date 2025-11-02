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
    w-10 h-10 sm:w-auto sm:px-3
    border-2 border-transparent dark:border-red-400/60 
    bg-red-600 hover:bg-red-700 
    dark:bg-red-900 dark:hover:bg-red-800 
    text-gray-300
    transition-all duration-200 
    hover:scale-[1.03]
    shadow-md hover:shadow-lg 
    shadow-red-900/40 dark:shadow-red-950/50
  "
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
