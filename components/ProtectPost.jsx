"use client";
import { protectPost } from "@/lib/actions/post";
import { MdHideSource } from "react-icons/md";
import { IoShieldOutline } from "react-icons/io5";
import { IoShieldSharp } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { showToast } from "@/lib/utils/toast";
export default function ProtectPostPage({ id, isProtected }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await protectPost(id);
      if (result.success) {
        showToast(
          `${result.updatedPost.isProtected ? "Protected" : "Unprotected"} Post`
        );
        setOpen(false);
      } else {
        showToast("Failed to Toggle", "error");
      }
    } catch (e) {
      showToast("Failed to Toggle", "error");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="
    w-8 h-8 sm:w-10 sm:h-10
    grid place-items-center 
    rounded-full 
    cursor-pointer 
    transition-all duration-300 
    bg-gray-100 dark:bg-neutral-900 
    border border-gray-400 dark:border-gray-300
    text-gray-700 dark:text-gray-400 
    shadow-md shadow-black/40 
    hover:scale-105 hover:shadow-lg 
    hover:border-indigo-500/60 dark:hover:border-indigo-400/60 
    hover:text-indigo-500 dark:hover:text-indigo-300
  "
        aria-label={isProtected ? "Unprotect post" : "Protect post"}
      >
        {isProtected ? (
          <IoShieldSharp className="text-yellow-500" />
        ) : (
          <IoShieldOutline />
        )}
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-[300px] sm:w-[300px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will {isProtected ? "Unprotect" : "Protect"} this post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="ml-auto">
          <Button type="submit" className="cursor-pointer" aria-label={isProtected ? "Confirm unprotect post" : "Confirm protect post"}>
            {isProtected ? "Unprotect" : "Protect"} Post
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}