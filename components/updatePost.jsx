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
import { updatePost } from "@/lib/actions/post";
import { showToast } from "@/lib/utils/toast";
import Image from "next/image";
export default function updatePostPage({
  id,
  text,
  imageUrl,
  username,
  isAdmin,
}) {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setContent(text);
  }, [id, text]);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await updatePost(id, content.trim());
      if (result.success) {
        showToast("Post Updated");
        setOpen(false);
      } else {
        showToast("Failed to Update Post", "error");
      }
    } catch (e) {
      showToast("Failed to Update Post", "error");
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
        className=" w-8 h-8 sm:w-10 sm:h-10
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
    hover:text-indigo-500 dark:hover:text-indigo-300"
      >
        <BiEdit size={18} className="sm:size-[20px] text-inherit" />
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
                alt="Profile"
                className="rounded-full border-2 border-blue-500 shadow-xl w-10 h-10"
              />
            )}
            <div className="flex flex-1 flex-col justify-center items-start">
              {!isAdmin && (
                <span className="font-bold text-gray-900 text-left">
                  {username}
                </span>
              )}
              {/* <input
                type="text"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                placeholder="What's happening?"
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 outline-none text-lg leading-relaxed dark:text-gray-300"
              /> */}
              <textarea
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                value={content}
                placeholder="What's happening?"
                rows={4}
                className="w-full resize-none bg-transparent text-gray-900 placeholder-gray-500 outline-none text-lg leading-relaxed dark:text-gray-300"
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex items-center justify-center mt-4 gap-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
