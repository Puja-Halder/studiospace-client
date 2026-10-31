
import { Suspense } from "react";
import ExploreSpaces from "@/components/ExploreSpaces";

function ExploreLoading() {
  return (
    <main className="min-h-screen flex-1 bg-gray-50">
      <div className="h-64 animate-pulse bg-violet-950" />
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="h-32 animate-pulse rounded-2xl bg-gray-200" />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreLoading />}>
      <ExploreSpaces />
    </Suspense>
  );
}
