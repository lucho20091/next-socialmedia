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
        {getPost && (
          <div className="p-4 sm:p-8 pb-16">
            {/* post header */}
            <div className="flex items-start space-x-3">
              <Link href={`/profile/${getPost.author.id}`}>
                <Image
                  src={getPost.author.avatar || "/default-profile.jpg"}
                  width={40}
                  height={40}
                  alt={`${getPost.author.username} avatar`}
                  className="rounded-full border-2 border-blue-500 shadow-xl w-10 h-10"
                />
              </Link>
              <div className="flex-1">
                <div className="flex flex-wrap items-center space-x-2">
                  <Link href={`/profile/${getPost.author.id}`}>
                    <span className="font-bold text-gray-900">
                      {getPost.author.username}
                    </span>
                  </Link>
                  <span className="text-gray-500 text-xs sm:text-base">
                    {formatDate(getPost.updatedAt)}
                  </span>
                </div>
              </div>
              {prismaUser && getPost.author.id === prismaUser.id && (
                <div className="ml-auto flex gap-2">
                  <UpdatePostPage
                    id={getPost.id}
                    text={getPost.content}
                    imageUrl={prismaUser.avatar || "/default-profile.jpg"}
                    username={prismaUser.username}
                  />

                  <DeletePostPage id={getPost.id} />
                </div>
              )}
            </div>
            {/* post content */}
            <div className="ml-13 mb-3 mt-[-16px]">
              <p className="text-gray-900 text-lg leading-relaxed">
                {getPost.content}
              </p>
            </div>
            {/* post image */}
            {getPost.imageUrl && !getPost.imageUrl.endsWith(".mp4") && (
              <div className="ml-13 mb-3 rounded-2xl bg-black">
                <Image
                  src={getPost.imageUrl}
                  width={500}
                  height={300}
                  alt={`Image posted by ${getPost.author.username}`}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
            {/* post video */}
            {getPost.imageUrl && getPost.imageUrl.endsWith(".mp4") && (
              <video
                src={getPost.imageUrl}
                className="w-full max-w-[500px] mx-auto h-auto object-contain mb-4 rounded-md"
                controls
              />
            )}
            {/* post actions */}
            <div className="ml-13 grid grid-cols-[1fr_1.5fr_0.5fr] sm:grid-cols-3">
              <div className="flex items-center justify-start gap-2 sm:gap-4 ">
                <LikePost
                  postId={getPost.id}
                  currentLikes={getPost.likedBy}
                  userId={prismaUser ? prismaUser.id : null}
                />
              </div>
              <div className="flex items-center justify-start gap-2 sm:gap-4 select-none">
                <CgComment size="20px" />

                <div>
                  <span>{getPost.comments.length} </span>
                  <span className="hidden sm:inline">
                    {getPost.comments.length === 1 ? "comment" : "comments"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 ">
                <SharePostPage id={getPost.id} />
              </div>
            </div>
            {/* comment section */}
            <div className="ml-13 mt-4 space-y-3">
              {getPost.comments.length > 0 &&
                getPost.comments.map((item) => (
                  <div key={item.id}>
                    <div className="flex items-start space-x-3 px-2 pt-2 rounded-lg hover:bg-gray-100">
                      <Link href={`/profile/${item.author.id}`}>
                        <Image
                          src={item.author.avatar || "/default-profile.jpg"}
                          width={40}
                          height={40}
                          alt="Profile"
                          className="rounded-full border-2 border-blue-500 shadow-xl w-10 h-10"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center space-x-2">
                          <Link
                            href={`/profile/${item.author.id}`}
                            className="font-semibold text-gray-900"
                          >
                            {item.author.username}
                          </Link>
                          <span className="text-gray-500 text-xs sm:text-base">
                            {formatDate(item.updatedAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{item.content}</p>
                      </div>
                      {prismaUser && item.author.id === prismaUser.id && (
                        <div className="ml-auto flex gap-2">
                          <UpdateCommentPage
                            id={item.id}
                            text={item.content}
                            imageUrl={
                              prismaUser.avatar || "/default-profile.jpg"
                            }
                            username={prismaUser.username}
                          />
                          <DeleteCommentPage commentId={item.id} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            {/* comment form */}
            {prismaUser && (
              <div className="pt-3">
                <div className="flex items-start space-x-3">
                  <Image
                    src={prismaUser.avatar || "/default-profile.jpg"}
                    width={40}
                    height={40}
                    alt={`${prismaUser.username} avatar`}
                    className="rounded-full border-2 border-blue-500 shadow-xl w-10 h-10"
                  />

                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-md p-3">
                      <CreateComment postId={getPost.id} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
