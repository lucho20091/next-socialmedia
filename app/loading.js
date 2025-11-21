import PostSkeleton from "@/components/PostSkeleton";

export default function Loading() {
  return (
    <div className="min-h-[calc(100svh-100px)] max-w-2xl mx-auto py-6 sm:py-8">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
}