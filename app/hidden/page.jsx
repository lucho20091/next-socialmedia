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
  const hiddenPosts = await readHiddenPosts();

  return (
    <div className="min-h-[calc(100svh-100px)]">
      <div className="max-w-2xl mx-auto">
        {prismaUser &&
          hiddenPosts.success &&
          hiddenPosts?.hiddenPosts?.length > 0 &&
          hiddenPosts?.hiddenPosts?.map((item, index) => (
            <PostPage
              key={item.id}
              prismaUser={prismaUser}
              post={item}
              displayComments={false}
              index={index}
            />
          ))}
      </div>
    </div>
  );
}
