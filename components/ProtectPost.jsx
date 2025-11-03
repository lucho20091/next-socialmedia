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
import toast from "react-hot-toast";
export default function ProtectPostPage({ id, isProtected }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log(id);
      const result = await protectPost(id);
      if (result.success) {
        toast("Protect Post Toggled", {
          style: { background: "#333", color: "#fff" },
        });
        setOpen(false);
      } else {
        toast.error("Failed to Protect Post Toggle", {
          style: { background: "#333", color: "#fff" },
        });
      }
    } catch (e) {
      toast.error("Failed to Protect Post Toggle", {
        style: { background: "#333", color: "#fff" },
      });
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
      >
        {isProtected ? (
          <IoShieldSharp className="text-yellow-500" />
        ) : (
          <IoShieldOutline />
        )}
        {/* <MdHideSource size={18} className="sm:size-[20px] text-inherit" /> */}
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-[300px] sm:w-[300px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will toggle protect this post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="ml-auto">
          <Button type="submit" className="cursor-pointer">
            Toggle Protect Post
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
