"use server";

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import { unstable_cache, revalidateTag } from "next/cache";
import { limit } from "@/lib/utils/rate-limit";

const getCachedHiddenPosts = unstable_cache(
  async (email, isAdmin, userId) => {
    const whereCondition = isAdmin
      ? { isHidden: true }
      : { isHidden: true, authorId: userId };

    const hiddenPosts = await prisma.post.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        likedBy: true,
        comments: {
          take: 2,
          orderBy: { updatedAt: "desc" },
          include: { author: true },
        },
        _count: { select: { comments: true } },
      },
    });
    hiddenPosts.forEach((post) => {
      post.comments = post.comments.reverse();
    });
    return hiddenPosts;
  },

  ["hidden-posts"],

  {
    tags: ["posts", "hidden-posts"],
    revalidate: 300,
  }
);

const getCachedMainPosts = unstable_cache(
  async () => {
    const allPosts = await prisma.post.findMany({
      where: { isHidden: false },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        author: true,
        likedBy: true,
        comments: {
          take: 2,
          orderBy: { updatedAt: "desc" },
          include: { author: true },
        },
        _count: { select: { comments: true } },
      },
    });

    allPosts.forEach((post) => {
      post.comments = post.comments.reverse();
    });

    return allPosts;
  },

  ["main-posts"],
  {
    tags: ["posts", "main-posts"],
    revalidate: 300,
  }
);

export const createPost = async (content, mediaUrl, isHidden, ip) => {
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });
    const allowed = limit(ip, 3, 3_600_000);
    if (!allowed && !existingUser.isAdmin) {
      return {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      };
    }
    const createPostUser = await prisma.post.create({
      data: {
        content: content || null,
        authorId: existingUser.id,
        mediaUrl: mediaUrl || null,
        isHidden: isHidden || false,
      },
    });
    revalidateTag("posts");
    revalidateTag("users");
    return {
      success: true,
      data: { ...createPostUser },
    };
  } catch (e) {
    return {
      success: false,
      error: "error creating post",
    };
  }
};

export const readMainPosts = async () => {
  try {
    const allPosts = await getCachedMainPosts();
    return allPosts;
  } catch (e) {
    return null;
  }
};

export const updatePost = async (id, content, ip) => {
  try {
    const user = await stackServerApp.getUser();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });
    const allowed = limit(ip, 3, 3_600_000);
    if (!allowed && !existingUser.isAdmin) {
      return {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      };
    }
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    if (
      existingPost.isProtected &&
      existingUser.isAdmin &&
      existingPost.authorId !== existingUser.id
    ) {
      return {
        success: false,
        error: "Protected post: only the author can update this post",
      };
    }

    const canUpdate =
      (existingPost.isProtected &&
        existingUser.isAdmin &&
        existingPost.authorId === existingUser.id) ||
      (!existingPost.isProtected && existingUser.isAdmin) ||
      (!existingUser.isAdmin && existingPost.authorId === existingUser.id);

    if (!canUpdate) {
      return {
        success: false,
        error: "You are not authorized to update this post",
      };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { content },
    });
    revalidateTag("posts");
    return {
      success: true,
      data: updatedPost,
    };
  } catch (e) {
    return {
      success: false,
      error: "Error updating post",
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

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    if (
      existingPost.isProtected &&
      existingUser.isAdmin &&
      existingPost.authorId !== existingUser.id
    ) {
      return {
        success: false,
        error: "Protected post: only the author can delete this post",
      };
    }

    const canDelete =
      (existingPost.isProtected &&
        existingUser.isAdmin &&
        existingPost.authorId === existingUser.id) ||
      (!existingPost.isProtected && existingUser.isAdmin) ||
      (!existingUser.isAdmin && existingPost.authorId === existingUser.id);

    if (!canDelete) {
      return {
        success: false,
        error: "You are not authorized to delete this post",
      };
    }

    const deletedPost = await prisma.post.delete({
      where: { id },
    });
    revalidateTag("posts");
    revalidateTag("users");
    return {
      success: true,
      deletedPost,
    };
  } catch (e) {
    return {
      success: false,
      error: "Error deleting post",
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

    const post = await prisma.post.findUnique({
      where: { id },
      select: { isHidden: true, isProtected: true, authorId: true },
    });

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    if (
      post.isProtected &&
      existingUser.isAdmin &&
      post.authorId !== existingUser.id
    ) {
      return {
        success: false,
        error: "Protected post: only the author can hide/unhide this post",
      };
    }

    const canToggle =
      (post.isProtected &&
        existingUser.isAdmin &&
        post.authorId === existingUser.id) ||
      (!post.isProtected && existingUser.isAdmin) ||
      (!existingUser.isAdmin && post.authorId === existingUser.id);

    if (!canToggle) {
      return {
        success: false,
        error: "You are not authorized to toggle visibility for this post",
      };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { isHidden: !post.isHidden },
    });
    revalidateTag("posts");
    revalidateTag("users");
    return {
      success: true,
      updatedPost,
    };
  } catch (e) {
    return {
      success: false,
      error: "Error toggling post visibility",
    };
  }
};

export const protectPost = async (id) => {
  try {
    const user = await stackServerApp.getUser();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.primaryEmail,
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    if (existingUser.isAdmin && post.authorId === existingUser.id) {
      const updatedPost = await prisma.post.update({
        where: { id: id },
        data: { isProtected: !post.isProtected },
      });
      revalidateTag("posts");
      return {
        success: true,
        updatedPost,
      };
    }

    return {
      success: false,
      error: "Only the admin who authored the post can protect/unprotect it",
    };
  } catch (e) {
    return {
      success: false,
      error: "Error protecting post",
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
    revalidateTag("posts");
    revalidateTag("users");
    return {
      success: true,
      data: { ...updateLikePost },
    };
  } catch (e) {
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
    revalidateTag("posts");
    revalidateTag("users");
    return {
      success: true,
      data: { ...updateLikePost },
    };
  } catch (e) {
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
        where: { email: user?.primaryEmail },
      });
    }

    const postById = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        likedBy: true,
        comments: {
          orderBy: { updatedAt: "asc" },
          include: { author: true },
        },
      },
    });

    if (!postById) return null;

    if (postById.isHidden && !existingUser?.isAdmin) {
      return null;
    }

    return postById;
  } catch (e) {
    return null;
  }
};

export const readHiddenPosts = async () => {
  try {
    const user = await stackServerApp.getUser();

    const existingUser = await prisma.user.findUnique({
      where: { email: user.primaryEmail },
    });

    if (!existingUser) {
      return { success: false, error: "User not found" };
    }

    const hiddenPosts = await getCachedHiddenPosts(
      user.primaryEmail,
      existingUser.isAdmin,
      existingUser.id
    );

    return { success: true, hiddenPosts };
  } catch (e) {
    return { success: false, error: "Error fetching hidden posts" };
  }
};
