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
        <Button variant="destructive" className="cursor-pointer">
          Log out
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
