import { readPostById } from "@/lib/actions/post";
import { stackServerApp } from "@/stack/server";
import { getUserByEmail } from "@/lib/actions/user";
import { formatDistanceToNow } from "date-fns";
import UpdatePostPage from "@/components/updatePost";
import DeletePostPage from "@/components/DeletePost";
import { CgComment } from "react-icons/cg";
import LikePost from "@/components/LikePost";
import SharePostPage from "@/components/SharePost";
import DeleteCommentPage from "@/components/DeleteComment";
import UpdateCommentPage from "@/components/UpdateComment";
import CreateComment from "@/components/CreateComment";
import Link from "next/link";
import Image from "next/image";
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
  function formatDate(date) {
    const dateFns = formatDistanceToNow(date, { addSuffix: true });
    return dateFns.replace(/^about\s/, "");
  }
  return (
    <div className="min-h-[calc(100svh-68px)]">
      <div className="max-w-2xl mx-auto py-6">
        {getPost && <PostPage post={getPost} prismaUser={prismaUser} />}
      </div>
    </div>
  );
}
