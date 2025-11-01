"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function HasSeenPopUp() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
    }
  }, []);
  const handleClose = (open) => {
    setShowPopup(open);
    if (!open) {
      localStorage.setItem("hasSeenPopup", "true");
    }
  };

  return (
    <Dialog open={showPopup} onOpenChange={handleClose}>
      <DialogContent className="w-[90%] max-w-[350px] sm:w-[350px]">
        <DialogHeader>
          <DialogTitle>Welcome User 👋</DialogTitle>
          <DialogDescription className="space-y-2 text-base text-gray-700 dark:text-gray-300">
            This site lets you upload and share your favorite edits.
          </DialogDescription>
        </DialogHeader>
        <div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Sign in to start uploading</li>
            <li>Create and customize your profile</li>
            <li>Upload a profile image or change your username</li>
            <li>
              Post videos or images — choose to make them public or hidden
            </li>
            <li>Like and comment on other users’ posts</li>
          </ul>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-[50%] ml-auto cursor-pointer"
              onClick={() => {
                setShowPopup(false);
                localStorage.setItem("hasSeenPopup", "true");
              }}
            >
              Understood
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
