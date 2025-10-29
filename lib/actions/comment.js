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
      return createComment;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};
