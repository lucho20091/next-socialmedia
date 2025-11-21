"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache, revalidateTag } from "next/cache";

const getCachedFullUserById = unstable_cache(
  async (id) => {
    console.log("DB HIT - getFullUserById", id);

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        writtenPosts: {
          where: { isHidden: false },
          orderBy: { updatedAt: "desc" },
          include: {
            likedBy: true,
            author: true,
            _count: {
              select: { comments: true, likedBy: true },
            },
          },
        },
        likedPosts: {
          where: { isHidden: false },
          orderBy: { updatedAt: "desc" },
          include: {
            author: true,
            likedBy: true,
            _count: {
              select: { comments: true, likedBy: true },
            },
          },
        },
        comments: true,
      },
    });

    if (!existingUser) return null;
    return existingUser;
  },
  ["full-user-by-id"], // base cache key
  {
    tags: ["users"], // 🔖 use this tag to invalidate later with revalidateTag("users")
    revalidate: 300, // optional: auto-refresh every 5 minutes
  }
);
const getCachedUserById = unstable_cache(
  async (id) => {
    console.log("DB HIT - getUserById", id);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) return null;
    return existingUser;
  },
  ["user-by-id"], // cache key
  {
    tags: ["users"], // 🔖 allows revalidation via revalidateTag("users")
    revalidate: 300, // optional auto-refresh every 5 minutes
  }
);
const getCachedUserByEmail = unstable_cache(
  async (email) => {
    console.log("DB HIT - getUserByEmail", email);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) return null;
    return existingUser;
  },
  ["user-by-email"], // base cache key
  {
    tags: ["users"], // 🔖 allows revalidation via revalidateTag("users")
    revalidate: 300, // optional auto-refresh every 5 minutes
  }
);
export const getUserByEmail = async (email) => {
  try {
    const user = await getCachedUserByEmail(email);
    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
};
export const getUserById = async (id) => {
  try {
    const user = await getCachedUserById(id);
    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
};
export const getFullUserById = async (id) => {
  try {
    const user = await getCachedFullUserById(id);
    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
};
export const updateUser = async (id, data) => {
  try {
    // Filter out undefined or null fields
    const updateData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    // Prevent empty update
    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields provided to update");
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: updateData,
    });
    revalidateTag("users");
    return updatedUser;
  } catch (e) {
    console.error("Error updating user:", e);
    return null;
  }
};
// getuseravatarbyid im not using it
export const getUserAvatarById = async (id) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        avatar: true,
      },
    });
    if (!existingUser) {
      return null;
    }
    return existingUser;
  } catch (e) {
    console.log(e);
    return null;
  }
};
// getFullUserByEmail im not using it
export const getFullUserByEmail = async (email) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        writtenPosts: true,
        likedPosts: true,
        comments: true,
      },
    });
    if (!existingUser) return null;
    return existingUser;
  } catch (e) {
    console.log(e);
    return null;
  }
};
// checkifsameuser im not using it
export const checkIfSameUser = async (user, id) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        email: true,
      },
    });
    if (!existingUser) return false;
    const sameUser = existingUser.email === user.primaryEmail ? true : false;
    return sameUser;
  } catch (e) {
    console.log(e);
    return false;
  }
};
