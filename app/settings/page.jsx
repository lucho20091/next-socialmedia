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
    <div className="min-h-[calc(100svh-68px)]">
      <div className="max-w-3xl mx-auto py-4 sm:p-6">
        <div
          className="bg-white rounded-xl shadow-md p-6 mx-4 dark:bg-neutral-900"
          data-aos="zoom-in-up"
          suppressHydrationWarning
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-400">
            Settings
          </h1>
          <p className="text-gray-500 mt-1">Update your profile information.</p>
          <div className="mt-6">
            {prismaUser ? (
              <SettingsForm
                userId={prismaUser.id}
                initialUsername={prismaUser.username}
                initialAvatar={prismaUser.avatar}
              />
            ) : (
              <div className="text-gray-500">
                Please sign in to edit your profile.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
