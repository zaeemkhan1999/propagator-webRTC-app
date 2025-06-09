import { EAllKey } from "../data";
import Lottie from "lottie-react";
import Tag from "../../../../components/Tags";
import NoData from "../../../utility/Nodata.json";
import { useTag_GetTagsQuery } from "../queries/getExploreTags";
import { useEffect, useRef } from "react";
import { CircularProgress } from "@mui/material";

export function Tags({ searchTerm, selectedTab }: any) {

  const { data, isFetching, fetchNextPage, refetch } = useTag_GetTagsQuery(
    {
      skip: 0,
      take: 10,
      where: searchTerm ? { text: { contains: selectedTab === "Tags" ? searchTerm : "" } } : undefined,
    },
    {
      getNextPageParam: (lastPage, pages) => {
        const totalCount = lastPage?.tag_getTags?.result?.totalCount;
        const totalFetchedCount = pages.reduce(
          (sum, page) => sum + page.tag_getTags.result.items.length,
          0
        );
        if (totalFetchedCount < totalCount) {
          return totalFetchedCount;
        }
        return undefined;
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
    <div className="w-full h-screen overflow-y-auto pb-20 snap-y snap-mandatory bg-gray-100 p-1 pt-0">
      {(data?.length ? (
        <>
          {data.map((tag) => (
            <Tag type={EAllKey.Tags} key={tag.id} data={tag} />
          ))}
          <div ref={sentinelRef} className="h-px" />

          {isFetching &&
            <div className="flex items-center justify-center h-full w-full">
              < CircularProgress />
            </div>}
        </>
      ) : (
        <Lottie
          loop={false}
          animationData={NoData}
          style={{ width: "200px", height: "200px", margin: "0 auto" }}
        />
      ))}
    </div>
  );
}