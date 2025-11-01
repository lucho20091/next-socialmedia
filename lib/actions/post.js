"use server";

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export const createPost = async (content, mediaUrl, isHidden) => {
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
        isHidden: isHidden || false,
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

    // Verificar si el post existe y obtener el authorId
    const post = await prisma.post.findUnique({
      where: { id },
      select: { isHidden: true, authorId: true },
    });

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    // Permitir si el usuario es admin o el autor del post
    if (!existingUser.isAdmin && existingUser.id !== post.authorId) {
      return {
        success: false,
        error:
          "Unauthorized: Only admins or the post author can hide this post",
      };
    }

    // Toggle the hidden state
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        isHidden: !post.isHidden,
      },
    });

    return {
      success: true,
      updatedPost,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: "Error toggling post visibility",
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

    if (!existingUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const whereCondition = existingUser.isAdmin
      ? { isHidden: true } // Admin: ve todos los ocultos
      : { isHidden: true, authorId: existingUser.id }; // No admin: solo sus ocultos

    const hiddenPosts = await prisma.post.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: "desc",
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

    console.log(hiddenPosts);
    return {
      success: true,
      hiddenPosts,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: "Error fetching hidden posts",
    };
  }
};
