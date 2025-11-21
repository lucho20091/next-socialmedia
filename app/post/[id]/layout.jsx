import { readPostById } from "@/lib/actions/post";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const post = await readPostById(id);
    const username = post?.author?.username ?? "user";
    return {
      title: `Post by ${username}`,
      description: post?.content
        ? post.content.slice(0, 140)
        : "View post and comments",
    };
  } catch {
    return {
      title: "Post",
      description: "View post and comments",
    };
  }
}

export default function PostLayout({ children }) {
  return <section>{children}</section>;
}
