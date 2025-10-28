import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export default async function page() {
  const user = await getCurrentUser();
  const products = await prisma.product.findMany();
  console.log(products);
  return (
    <div className="px-4">
      test
      {products.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </div>
  );
}
