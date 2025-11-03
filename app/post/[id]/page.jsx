import { readPostById } from "@/lib/actions/post";
import { stackServerApp } from "@/stack/server";
import { getUserByEmail } from "@/lib/actions/user";

import PostPage from "@/components/Post";
export default async function page({ params }) {
  const { id } = await params;
  const user = await stackServerApp.getUser();
  let prismaUser;
  if (user) {
    prismaUser = await getUserByEmail(user.primaryEmail);
  }
  const getPost = await readPostById(id);
  console.log(getPost);
  return (
    <div className="min-h-[calc(100svh-100px)]">
      <div className="max-w-2xl mx-auto py-6 sm:py-8">
        {getPost && <PostPage post={getPost} prismaUser={prismaUser} />}
      </div>
    </div>
  );
}
