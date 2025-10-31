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
          className="cursor-pointer rounded-full sm:rounded-2xl w-10 h-10 sm:w-auto border-2 dark:border-red-400 border-red-900 sm:border-0"
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
