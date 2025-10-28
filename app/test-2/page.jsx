import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";
import {
  checkIfSameUser,
  getUserById,
  getFullUserById,
  getUserByEmail,
} from "@/lib/actions/user";
export default async function page() {
  const user = await stackServerApp.getUser();
  const prismaUser = await getUserByEmail(user.primaryEmail);
  const isSameUser = await checkIfSameUser(user, prismaUser.id);
  const userById = await getUserById(prismaUser.id);
  const FullUserById = await getFullUserById(prismaUser.id);
  console.log(isSameUser);
  console.log(userById);
  console.log(FullUserById);
  return <div>test 2</div>;
}
