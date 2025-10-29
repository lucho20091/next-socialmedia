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
import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function DeletePostPage({ id }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await deletePost(id);
      if (result.success) {
        toast.success("deleted post successfully");
        setOpen(false);
        router.back();
      }
    } catch (e) {
      toast.error("failed to delete post");
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
