import { stackServerApp } from "@/stack/server";
import { getUserByEmail } from "@/lib/actions/user";
import SettingsForm from "@/components/SettingsForm";
export default async function Page() {
  const user = await stackServerApp.getUser();
  let prismaUser = null;
  if (user?.primaryEmail) {
    prismaUser = await getUserByEmail(user.primaryEmail);
  }

  return (
    <div className="min-h-[calc(100svh-100px)]">
      <div className="max-w-2xl mx-auto py-6 sm:py-8">
        <div
          className="
    mx-4 sm:mx-6 
    p-6 sm:p-8 
    rounded-2xl 
    bg-white/90 dark:bg-neutral-900/90 
    border border-gray-200 dark:border-neutral-800 
    shadow-md shadow-black/30 dark:shadow-black/50 
    backdrop-blur-sm 
    transition-all duration-300 
    hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/10 
    hover:-translate-y-[2px]
  "
        >
          <h1
            className="
      text-2xl sm:text-3xl font-semibold 
      text-gray-900 dark:text-gray-200 
      flex items-center gap-2
    "
          >
            <span className="text-indigo-600 dark:text-indigo-400">⚙</span>{" "}
            Settings
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update your profile information.
          </p>

          <div className="mt-6">
            {prismaUser ? (
              <SettingsForm
                userId={prismaUser.id}
                initialUsername={prismaUser.username}
                initialAvatar={prismaUser.avatar}
              />
            ) : (
              <div className="text-gray-500 dark:text-gray-400 italic">
                Please sign in to edit your profile.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}