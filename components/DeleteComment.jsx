"use client";
import { deleteComment } from "@/lib/actions/comment";
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
import { showToast } from "@/lib/utils/toast";
export default function DeleteCommentPage({ commentId }) {
  const [open, setOpen] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await deleteComment(commentId);
      if (result.success) {
        showToast("Comment Deleted");
        setOpen(false);
      }
    } catch (e) {
      showToast("Failed to Delete Comment", "error");
    }
  }
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
    border border-red-400/70 dark:border-red-500/60 
    text-red-600 dark:text-red-500/70 
    shadow-sm shadow-black/30 
    hover:scale-105 hover:shadow-md 
    hover:bg-red-50/40 dark:hover:bg-red-900/30 
    hover:border-red-500 dark:hover:border-red-400 
    hover:text-red-500 dark:hover:text-red-400
  "
      >
        <AiOutlineDelete size={16} className="sm:size-[18px] text-inherit" />
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-[300px] sm:w-[300px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            comment.
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
