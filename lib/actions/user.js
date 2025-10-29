"use server";

import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
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
export const getUserById = async (id) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: id,
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
export const getFullUserById = async (id) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: id,
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

    return updatedUser;
  } catch (e) {
    console.error("Error updating user:", e);
    return null;
  }
};

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
