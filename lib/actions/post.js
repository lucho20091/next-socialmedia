"use server";

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export const createPost = async (content, imageUrl) => {
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });
    const createPostUser = await prisma.post.create({
      data: {
        content: content || null,
        authorId: existingUser.id,
        imageUrl: imageUrl || null,
      },
    });
    return {
      success: true,
      data: { ...createPostUser },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "error creating post",
    };
  }
};

export const readMainPosts = async () => {
  try {
    const user = await stackServerApp.getUser();
    if (user) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.primaryEmail,
        },
      });
      const allPosts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        include: {
          author: true,
          likedBy: true,
          comments: true,
        },
      });
      return allPosts;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};
