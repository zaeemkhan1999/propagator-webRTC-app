import { usePost_GetPostsQuery } from "../queries/getExploreTexts";
import { Skeleton } from "@mui/material";
import TextFeed from "../../../../components/TextFeed";
import { useEffect, useRef } from "react";

export function Texts({ searchTerm, userId }: { searchTerm: string, userId: number }) {
  const { data, isFetching, fetchNextPage, refetch } = usePost_GetPostsQuery(
    {
      skip: 0,
      take: 10,
      where: {
        post: {
          postItemsString: {
            eq: "[]",
          },
          isCreatedInGroup: {
            eq: false,
          },
          yourMind: {
            contains: searchTerm,
          },
        },
      },
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const timer = setTimeout(refetch, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!isFetching && entries[0].isIntersecting) fetchNextPage();
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [isFetching, fetchNextPage]);

  return (
    <div className="w-full h-screen md:h-screen pb-[200px] overflow-y-auto  bg-gray-100 p-1">

      {data?.map((post) => (
        <TextFeed key={post.post.id} post={post} userId={userId} />
      ))}
      <div ref={sentinelRef} className="h-px" />
      {isFetching && (
        <div className="px-4 py-1 w-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="bg-gray-200" variant="circular" width={40} height={40} />
              <Skeleton className="bg-gray-200" variant="rectangular" width={100} height={15} />
            </div>
            <div>
              <Skeleton className="bg-gray-200" variant="rectangular" width={30} height={15} />
            </div>
          </div>
          <Skeleton className="bg-gray-200" variant="text" width={"100%"} height={35} />
          <Skeleton className="bg-gray-200" variant="rounded" width={"100%"} height={60} />
        </div>
      )}
    </div>
  );
}
