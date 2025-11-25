import { getUserById } from "@/lib/actions/user";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const user = await getUserById(id);
    const username = user.username ?? "user";
    return {
      title: `${username}'s profile`,
      description: `this is ${username}'s profile`,
    };
  } catch {
    return {
      title: "Profile",
      description: "View profile",
    };
  }
}

export default function ProfileLayout({ children }) {
  return <section>{children}</section>;
}