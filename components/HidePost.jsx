"use client";
import { hidePost } from "@/lib/actions/post";
import { MdHideSource } from "react-icons/md";
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
import { useRouter, usePathname } from "next/navigation";
import { showToast } from "@/lib/utils/toast";
export default function HidePostPage({ id, isHidden }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await hidePost(id);
      if (result.success) {
        showToast(
          `${result.updatedPost.isHidden ? "Hidden" : "Unhidden"} Post`
        );
        setOpen(false);
        if (pathname.startsWith("/post/")) {
          console.log(pathname);
          router.back();
        }
      } else {
        showToast("Failed to Toggle Visibility", "error");
      }
    } catch (e) {
      showToast("Failed to Toggle Visibility", "error");
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
        aria-label={isHidden ? "Unhide post" : "Hide post"}
      >
        <MdHideSource size={18} className="sm:size-[20px] text-inherit" />
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-[300px] sm:w-[300px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will {isHidden ? "Unhide" : "Hide"} this post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="ml-auto">
          <Button type="submit" className="cursor-pointer" aria-label={isHidden ? "Confirm unhide post" : "Confirm hide post"}>
            {isHidden ? "Unhide" : "Hide"} Post
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}