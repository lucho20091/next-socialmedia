"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";

export async function deleteProduct(formData) {
  const user = await getCurrentUser();
  const id = String(formData.get("id") || "");

  await prisma.product.deleteMany({
    where: { id: id, userId: user.id },
  });
}

export async function createProduct(formData) {
  const user = await getCurrentUser();

  // Extract and normalize values
  const name = formData.get("name")?.trim();
  const price = Number(formData.get("price"));
  const quantity = Number(formData.get("quantity"));
  const sku = formData.get("sku") || undefined;
  const lowStockAt = formData.get("lowStockAt")
    ? Number(formData.get("lowStockAt"))
    : undefined;

  // Basic validation (you can expand this as needed)
  if (!name) throw new Error("Name is required");
  if (isNaN(price) || price < 0)
    throw new Error("Price must be a non-negative number");
  if (!Number.isInteger(quantity) || quantity < 0)
    throw new Error("Quantity must be a non-negative integer");
  if (lowStockAt !== undefined && (isNaN(lowStockAt) || lowStockAt < 0)) {
    throw new Error("Low stock value must be a non-negative number");
  }

  try {
    await prisma.product.create({
      data: { name, price, quantity, sku, lowStockAt, userId: user.id },
    });
    console.log("successfully added");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create product.");
  }

  redirect("/inventory");
}
