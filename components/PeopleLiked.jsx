"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PeopleLiked({ userHasLiked, likes }) {
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={`cursor-pointer select-none
            ${
              userHasLiked
                ? "text-blue-500 dark:text-blue-800 font-semibold"
                : "text-gray-500 dark:text-gray-400"
            }
          `}
          aria-label={`${likes.length} ${likes.length === 1 ? "like" : "likes"}`}
        >
          {likes.length} {likes.length === 1 ? "like" : "likes"}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>People who liked this</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          {likes.length > 0 ? (
            likes.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label={`View ${user.username}'s profile`}
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt={`${user.username}'s avatar`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {user.username}
                </span>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No likes yet.
            </p>
          )}
        </div>

        <DialogFooter className="sm:justify-start mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
              aria-label="Close"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}