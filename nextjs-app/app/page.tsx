import { Suspense } from "react";
import Link from "next/link";

import { AllPosts } from "@/app/components/Posts";
import { Search } from "@/app/components/Search";

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <>
      <div className="bg-gradient-to-r from-red-200 from-0% via-white via-40%  relative">
        <div className="bg-gradient-to-b from-white w-full h-40 absolute top-0"></div>
        <div className="bg-gradient-to-t from-white w-full h-40 absolute bottom-0"></div>
        <div className="container relative">
          <div className="mx-auto max-w-2xl py-20 lg:max-w-4xl lg:px-12 text-center">
            <div className="flex flex-col gap-4 items-center">
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black">
                <Link className="text-red-500 " href="https://sanity.io/">
                  Sanity
                </Link>{" "}
                +{" "}
                <Link className="text-[#000] " href="https://algolia.com/">
                  Algolia
                </Link>
              </h1>
            </div>
            <div className="mt-6 space-y-6 prose sm:prose-lg md:prose-xl lg:prose-2xl text-gray-700">
              <p>
                By integrating Sanity's structured content with Algolia, you can provide your users with fast, relevant search results and gather insights into what they are looking for.
              </p>
            </div>
              <h3 className="p-2 mt-8 text-4xl font-semibold">Search with Algolia</h3>
            <div className="mt-2">
              <Search />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-10">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>
              <AllPosts />
            </Suspense>
          </aside>
        </div>
      </div>
    </>
  );
}
