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
          updatedAt: "desc",
        },
        take: 10,
        include: {
          author: true,
          likedBy: true,
          comments: {
            take: 2,
            orderBy: {
              updatedAt: "desc",
            },
            include: {
              author: true,
            },
          },
          _count: {
            select: { comments: true },
          },
        },
      });
      allPosts.forEach((post) => {
        post.comments = post.comments.reverse();
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

export const updatePost = async (id, content) => {
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });

    const updatePostUser = await prisma.post.update({
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
      data: { ...updatePostUser },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "error creating post",
    };
  }
};

export const deletePost = async (id) => {
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });
    const deletePost = await prisma.post.delete({
      where: {
        id: id,
        authorId: existingUser.id,
      },
    });
    return {
      success: true,
      deletePost,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "error deleting post",
    };
  }
};
