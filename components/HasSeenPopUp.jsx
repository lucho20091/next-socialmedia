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
      localStorage.setItem("hasSeenPopup", "true");
    }
  }, []);

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="w-[90%] max-w-[350px] sm:w-[350px]">
        <DialogHeader>
          <DialogTitle>Welcome User 👋</DialogTitle>
          <DialogDescription className="space-y-2 text-base text-gray-700 dark:text-gray-300">
            Upload and share your favorite videos.
          </DialogDescription>
        </DialogHeader>
        <div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Sign in to start uploading</li>
            <li>Create and customize your profile</li>
            <li>Post videos or images</li>
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
              Got it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
