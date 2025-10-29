"use server";

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export const createComment = async (text, postId) => {
  try {
    const user = await stackServerApp.getUser();
    if (user) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.primaryEmail,
        },
      });
      const createComment = await prisma.comment.create({
        data: {
          content: text,
          authorId: existingUser.id,
          postId: postId,
        },
      });
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
        authorId: existingUser.id,
      },
    });
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
export const updateComment = async (id, content) => {
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });

    const updateCommentUser = await prisma.comment.update({
      where: {
        id: id,
        authorId: existingUser.id,
      },
      data: {
        content: content,
      },
    });
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
