"use server";

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export const createPost = async (content, mediaUrl) => {
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
        mediaUrl: mediaUrl || null,
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
    const allPosts = await prisma.post.findMany({
      where: {
        isHidden: false,
      },
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
        ...(existingUser.isAdmin ? {} : { authorId: existingUser.id }),
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
        ...(existingUser.isAdmin ? {} : { authorId: existingUser.id }),
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

export const hidePost = async (id) => {
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });
    if (!existingUser.isAdmin) {
      return {
        success: false,
        error: "Unauthorized: Only admins can hide posts",
      };
    }

    const hidePost = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        isHidden: true,
      },
    });

    return {
      success: true,
      hidePost,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "error hidding post",
    };
  }
};

export const likePost = async (id) => {
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });

    const updateLikePost = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        likedBy: {
          connect: { id: existingUser.id },
        },
      },
    });
    return {
      success: true,
      data: { ...updateLikePost },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "error liking post",
    };
  }
};

export const dislikePost = async (id) => {
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });

    const updateLikePost = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        likedBy: {
          disconnect: { id: existingUser.id },
        },
      },
    });
    return {
      success: true,
      data: { ...updateLikePost },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "error disliking post",
    };
  }
};

export const readPostById = async (id) => {
  try {
    const user = await stackServerApp.getUser();

    let existingUser;
    if (user) {
      existingUser = await prisma.user.findUnique({
        where: {
          email: user?.primaryEmail,
        },
      });
    }

    const postById = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
        likedBy: true,
        comments: {
          orderBy: {
            updatedAt: "asc",
          },
          include: {
            author: true,
          },
        },
      },
    });

    if (!postById) return null;

    // If post is hidden and user is not admin, don't return it
    if (postById.isHidden && !existingUser?.isAdmin) {
      return null;
    }

    return postById;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const readHiddenPosts = async () => {
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });
    if (!existingUser.isAdmin) {
      return {
        success: false,
        error: "Unauthorized: Only admins can see hidden posts",
      };
    }

    const hiddenPosts = await prisma.post.findMany({
      where: {
        isHidden: true,
      },
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

    return {
      success: true,
      hiddenPosts,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "error fetching posts",
    };
  }
};
