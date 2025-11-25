"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { BiEdit } from "react-icons/bi";
import { updateComment } from "@/lib/actions/comment";
import { showToast } from "@/lib/utils/toast";
import Image from "next/image";
export default function UpdateCommentPage({
  id,
  text,
  imageUrl,
  username,
  isAdmin = false,
}) {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setContent(text);
  }, [id, text]);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const ipRes = await fetch("/api/get-ip");
      const ip = await ipRes.text();
      

      const result = await updateComment(id, content.trim(), ip); 
      if (result.success) {
        showToast("Comment Updated");
        setOpen(false);
      } else {
        showToast("Failed to Update Comment", "error");
      }
    } catch (e) {
      showToast("Failed to Update Comment", "error");
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="
    w-7 h-7 sm:w-8 sm:h-8
    grid place-items-center 
    rounded-full 
    cursor-pointer 
    transition-all duration-300 
    bg-gray-100 dark:bg-neutral-900 
    border border-gray-400 dark:border-gray-300
    text-gray-700 dark:text-gray-400 
    shadow-sm shadow-black/30 
    hover:scale-105 hover:shadow-md 
    hover:border-indigo-500/60 dark:hover:border-indigo-400/60 
    hover:text-indigo-500 dark:hover:text-indigo-300
  "
        aria-label="Edit comment"
      >
        <BiEdit size={16} className="sm:size-[18px] text-inherit" />
      </DialogTrigger>
      <DialogContent className="top-5 translate-y-0 sm:top-1/2 sm:-translate-y-1/2">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes then save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="shadow-xl border-1 border-gray-200 p-4 flex items-start justify-start gap-4">
            {!isAdmin && (
              <Image
                src={imageUrl || "/default-profile.jpg"}
                width={40}
                height={40}
                alt={`${username} avatar`}
                className="rounded-full border-2 border-blue-500 shadow-xl w-10 h-10"
              />
            )}
            <div className="flex flex-1 flex-col justify-center items-start">
              {!isAdmin && (
                <span className="font-bold text-gray-900 text-left">
                  {username}
                </span>
              )}

              <textarea
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                value={content}
                placeholder="What's happening?"
                rows={4}
                className="w-full resize-none bg-transparent text-gray-900 placeholder-gray-500 outline-none text-lg leading-relaxed dark:text-gray-300"
                aria-label="Comment content"
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex items-center justify-center mt-4 gap-4">
              <DialogClose asChild>
                <Button variant="outline" aria-label="Cancel editing comment">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer" aria-label="Save changes to comment">
                Save changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}