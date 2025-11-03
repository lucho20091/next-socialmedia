"use server";

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import { unstable_cache, revalidateTag } from "next/cache";

const getCachedPostById = unstable_cache(
  async (id) => {
    console.log("DB hit", id);
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
    return postById;
  },
  // cache key
  ["post-by-id"],
  {
    tags: ["posts"], // tag used for revalidation
    revalidate: 300, // optional: auto revalidate every 60s
  }
);

const getCachedHiddenPosts = unstable_cache(
  // inner function (the actual DB read)
  async (email, isAdmin, userId) => {
    console.log("DB hit → fetching hidden posts");
    const whereCondition = isAdmin
      ? { isHidden: true } // Admin: sees all hidden posts
      : { isHidden: true, authorId: userId }; // Non-admin: sees only their own

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

    return hiddenPosts;
  },

  // 🧩 Cache key (static + dynamic)
  ["hidden-posts"],

  // ⚙️ Cache config
  {
    tags: ["posts", "hidden-posts"], // used for revalidation
    revalidate: 300, // cache for 5 minutes
  }
);

const getCachedMainPosts = unstable_cache(
  async () => {
    console.log("DB hit → fetching main posts"); // to confirm caching behavior

    const allPosts = await prisma.post.findMany({
      where: { isHidden: false },
      orderBy: { updatedAt: "desc" },
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

    // Reverse comment order (oldest → newest)
    allPosts.forEach((post) => {
      post.comments = post.comments.reverse();
    });

    return allPosts;
  },
  // 🧩 Cache key (static)
  ["main-posts"],
  {
    tags: ["posts", "main-posts"], // used to revalidate later
    revalidate: 300, // auto refresh every 5 min
  }
);

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
    revalidateTag("posts");
    revalidateTag("users");
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
    const allPosts = await getCachedMainPosts();
    return allPosts;
  } catch (e) {
    console.error(e);
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

    // Obtener el post actual
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    // Reglas de autorización:
    // 1️⃣ isProtected = true && admin && no es autor -> ❌ no permitir
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

    // 2️⃣ isProtected = false && admin && no es autor -> ✅ permitir
    // 3️⃣ isProtected = false && no admin && es autor -> ✅ permitir
    // 🚫 cualquier otro caso -> no permitir
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

    // Actualizar el post
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
    console.error(e);
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

    // Obtener el post actual
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    // 🔒 Reglas:
    // 1️⃣ isProtected = true && admin && no es autor -> ❌ no permitir
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

    // 2️⃣ isProtected = false && admin && no es autor -> ✅ permitir
    // 3️⃣ isProtected = false && no admin && es autor -> ✅ permitir
    // 🚫 cualquier otro caso -> no permitir
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

    // 🗑️ Eliminar el post
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
    console.error(e);
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

    // Obtener el post con la info necesaria
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

    // 🔒 Reglas:
    // 1️⃣ isProtected = true && admin && no es autor -> ❌ no permitir
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

    // 2️⃣ isProtected = false && admin && no es autor -> ✅ permitir
    // 3️⃣ isProtected = false && no admin && es autor -> ✅ permitir
    // 🚫 cualquier otro caso -> no permitir
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

    // ✅ Toggle isHidden
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
    console.error(e);
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

    // Solo permitir si el usuario es admin Y autor del post
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
    console.error(e);
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
    revalidateTag("posts");
    revalidateTag("users");
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
        where: { email: user?.primaryEmail },
      });
    }

    const postById = await getCachedPostById(id);
    if (!postById) return null;

    // restrict hidden posts
    if (postById.isHidden && !existingUser?.isAdmin) {
      return null;
    }

    return postById;
  } catch (e) {
    console.error(e);
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

    // 🧠 Fetch from cache
    const hiddenPosts = await getCachedHiddenPosts(
      user.primaryEmail,
      existingUser.isAdmin,
      existingUser.id
    );

    return { success: true, hiddenPosts };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Error fetching hidden posts" };
  }
};
