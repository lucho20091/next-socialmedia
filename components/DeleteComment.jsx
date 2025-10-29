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
import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
export default function DeleteCommentPage({ commentId }) {
  const [open, setOpen] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await deleteComment(commentId);
      if (result.success) {
        toast.success("deleted comment successfully");
        setOpen(false);
      }
    } catch (e) {
      toast.error("failed to delete comment");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer border-1 border-red-500">
        <AiOutlineDelete className="text-red-500" size="20px" />
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
