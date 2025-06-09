import Lottie from "lottie-react";
import Tag from "@/components/Tags";
import NoData from "../../../utility/Nodata.json";
import { useEffect, useRef } from "react";
import { EAllKey } from "../data";
import { useLink_GetLinksQuery } from "../queries/getExploreLinks";
import { CircularProgress } from "@mui/material";

function Links({ searchTerm, selectedTab }: any) {

  const { data, fetchNextPage, isFetching, refetch } = useLink_GetLinksQuery(
    { searchTerm: selectedTab === "Links" ? searchTerm : "" },
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
      {isFetching ? <div className="flex items-center justify-center h-full w-full">
        < CircularProgress />
      </div> : (data?.length ? (
        data.map((link) => (
          <>
            <Tag type={EAllKey.Links} key={link?.id} data={link} />
            <div ref={sentinelRef} className="h-px" />
          </>
        ))
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

export default Links;
