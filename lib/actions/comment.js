"use server";

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import { revalidateTag } from "next/cache";
import { limit } from "@/lib/utils/rate-limit"; // Import the limit function
export const createComment = async (text, postId, ip) => { // Added ip parameter
  console.log("Server-side IP received for createComment:", ip); // Log IP on server-side
  try {
    const user = await stackServerApp.getUser();
    if (user) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.primaryEmail,
        },
      });
      const allowed = limit(ip, 5, 3_600_000); // 5 comments per hour per IP
      if (!allowed && !existingUser.isAdmin) {
        return {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        };
      }
      const createComment = await prisma.comment.create({
        data: {
          content: text,
          authorId: existingUser.id,
          postId: postId,
        },
      });
      revalidateTag("posts");
      return { success: true, createComment };
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const deleteComment = async (id) => {
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });
    const deleteComment = await prisma.comment.delete({
      where: {
        id: id,
        ...(existingUser.isAdmin ? {} : { authorId: existingUser.id }),
      },
    });
    revalidateTag("posts");
    return {
      success: true,
      deleteComment,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "error deleting comment",
    };
  }
};
export const updateComment = async (id, content, ip) => { // Added ip parameter
  console.log("Server-side IP received for updateComment:", ip); // Log IP on server-side
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });
    const allowed = limit(ip, 5, 3_600_000); // 5 comments per hour per IP
    if (!allowed && !existingUser.isAdmin) {
      return {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      };
    }
    const updateCommentUser = await prisma.comment.update({
      where: {
        id: id,
        ...(existingUser.isAdmin ? {} : { authorId: existingUser.id }),
      },
      data: {
        content: content,
      },
    });
    revalidateTag("posts");
    return {
      success: true,
      data: { ...updateCommentUser },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "error updating comment",
    };
  }
};