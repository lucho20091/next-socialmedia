import PostSkeleton from "@/components/PostSkeleton";

export default function Loading() {
  return (
    <div className="min-h-[calc(100svh-100px)] max-w-2xl mx-auto py-6 sm:py-8">
      {/* Profile header skeleton */}
      <div className="flex items-start gap-4 p-6 sm:p-8 mx-4 sm:mx-6 rounded-2xl bg-white/90 dark:bg-neutral-900/90 border border-gray-200 dark:border-neutral-800 shadow-md shadow-black/30 dark:shadow-black/50 backdrop-blur-sm animate-pulse">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 dark:bg-neutral-700"></div>
        <div className="flex-1 min-w-0">
          <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 mb-3"></div>
          <div className="flex flex-wrap gap-4 text-sm sm:text-base">
            <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700"></div>
      </div>
      {/* Post skeletons */}
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
}