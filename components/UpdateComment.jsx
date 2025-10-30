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
import toast from "react-hot-toast";
import Image from "next/image";
export default function UpdateCommentPage({ id, text, imageUrl, username }) {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setContent(text);
  }, [id, text]);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await updateComment(id, content.trim());
      if (result.success) {
        toast.success("updated comment successfully");
        setOpen(false);
      } else {
        toast.error("failed to update comment");
      }
    } catch (e) {
      toast.error("failed to update comment");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer border-1 border-black">
        <BiEdit size="20px" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes then save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="shadow-xl border-1 border-gray-200 p-4 flex items-start justify-start gap-4">
            <Image
              src={imageUrl || "/default-profile.jpg"}
              width={40}
              height={40}
              alt="Profile"
              className="rounded-full border-2 border-blue-500 shadow-xl w-10 h-10"
            />
            <div className="flex flex-1 flex-col justify-center items-start">
              <span className="font-bold text-gray-900 text-left">
                {username}
              </span>
              <input
                type="text"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                placeholder="What's happening?"
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 outline-none text-lg leading-relaxed"
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
