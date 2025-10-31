import { stackServerApp } from "@/stack/server";
import { getUserByEmail } from "@/lib/actions/user";
import { readHiddenPosts } from "@/lib/actions/post";
import PostPage from "@/components/Post";

export default async function page() {
  const user = await stackServerApp.getUser();
  let prismaUser = null;
  if (user?.primaryEmail) {
    prismaUser = await getUserByEmail(user.primaryEmail);
  }
  let hiddenPosts;
  if (prismaUser.isAdmin) {
    hiddenPosts = await readHiddenPosts();
  }
  return (
    <div className="min-h-[calc(100svh-68px)]">
      <div className="max-w-3xl mx-auto py-4 sm:p-6">
        {prismaUser.isAdmin &&
          hiddenPosts.success &&
          hiddenPosts?.hiddenPosts?.length > 0 &&
          hiddenPosts?.hiddenPosts?.map((item) => (
            <PostPage
              key={item.id}
              prismaUser={prismaUser}
              post={item}
              displayComments={false}
            />
          ))}
      </div>
    </div>
  );
}
