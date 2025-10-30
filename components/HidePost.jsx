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
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
export default function HidePostPage({ id }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await hidePost(id);
      if (result.success) {
        toast.success("deleted post successfully");
        setOpen(false);
        if (pathname.startsWith("/post/")) {
          console.log(pathname);
          router.back();
        }
      }
    } catch (e) {
      toast.error("failed to delete post");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer border-1 border-black">
        <MdHideSource size="20px" />
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-[300px] sm:w-[300px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This will hide this post.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="ml-auto">
          <Button
            type="submit"
            variant="destructive"
            className="cursor-pointer"
          >
            Hide
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
