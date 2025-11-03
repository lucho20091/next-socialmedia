"use client";
import { deletePost } from "@/lib/actions/post";
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
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
export default function DeletePostPage({ id }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await deletePost(id);
      if (result.success) {
        toast("Post Deleted", {
          style: { background: "#333", color: "#fff" },
        });
        setOpen(false);
        if (pathname.startsWith("/post/")) {
          console.log(pathname);
          router.back();
        }
      }
    } catch (e) {
      toast.error("Failed to Delete Post", {
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
     border border-red-400/70 dark:border-red-500/60 
     text-red-600 dark:text-red-500/70 
    shadow-md shadow-black/40 
    hover:scale-105 hover:shadow-lg 
    hover:border-red-500/60 dark:hover:border-red-400/60 
    hover:text-red-500 dark:hover:text-red-300
  "
      >
        <AiOutlineDelete size={18} className="sm:size-[20px] text-inherit" />
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-[300px] sm:w-[300px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="ml-auto">
          <Button
            type="submit"
            variant="destructive"
            className="cursor-pointer"
          >
            Delete
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
