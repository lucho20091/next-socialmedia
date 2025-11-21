import DeleteCommentPage from "@/components/DeleteComment";
import UpdateCommentPage from "@/components/UpdateComment";
import Link from "next/link";
import Image from "next/image";

export default function Comment({
  item,
  prismaUser,
  transformAvatar,
  formatDate,
}) {
  return (
    <div key={item.id}>
      <div className="flex items-start space-x-3 pl-4 py-2 border-y-1 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-neutral-950">
        <Link href={`/profile/${item.author.id}`}>
          <Image
            src={transformAvatar(item.author.avatar)}
            width={40}
            height={40}
            sizes="40px"
            quality={60}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer transition-all duration-300 bg-gray-100 dark:bg-neutral-900 border border-gray-400 dark:border-neutral-700 shadow-md shadow-black/40 hover:scale-105 hover:shadow-lg hover:border-indigo-500/60 dark:hover:border-indigo-400/60"
          />
        </Link>

        <div className="flex-1">
          <div className="flex flex-col items-start sm:flex-row sm:items-center space-x-2">
            <Link
              href={`/profile/${item.author.id}`}
              className="font-semibold text-gray-900 dark:text-gray-400"
            >
              {item.author.username}
            </Link>
            <span className="text-gray-500 text-xs sm:text-base">
              {formatDate(item.updatedAt)}
            </span>
          </div>

          <p className="text-gray-700 leading-tight dark:text-gray-300">
            {item.content}
          </p>
        </div>

        {prismaUser &&
          (item.author.id === prismaUser.id || prismaUser.isAdmin) && (
            <div className="ml-auto flex gap-2">
              <UpdateCommentPage
                id={item.id}
                text={item.content}
                imageUrl={prismaUser.avatar || "/default-profile.jpg"}
                username={prismaUser.username}
                isAdmin={prismaUser.isAdmin}
              />

              <DeleteCommentPage commentId={item.id} />
            </div>
          )}
      </div>
    </div>
  );
}