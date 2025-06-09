import Lottie from "lottie-react";
import Tag from "@/components/Tags";
import { usePlace_GetPlacesQuery } from "../queries/getExplorePlaces";
import NoData from "../../../utility/Nodata.json";
import { useEffect, useRef } from "react";
import { EAllKey } from "../data";
import { CircularProgress } from "@mui/material";

export function Places({ searchTerm, selectedTab }: any) {


  const { data, isFetching, fetchNextPage, hasNextPage, refetch } = usePlace_GetPlacesQuery(
    {
      skip: 0,
      take: 10,
      where: {
        location: {
          contains: selectedTab === "Places" ? searchTerm : "",
        },
      },
    },
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
        if (hasNextPage && !isFetching && entries[0].isIntersecting) {
          fetchNextPage();
        }
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
  }, [isFetching, fetchNextPage, hasNextPage]);

  return (
    <div className="w-full h-screen overflow-y-auto pb-20 snap-y snap-mandatory bg-gray-100 p-1 pt-0">
      {isFetching ? <div className="flex items-center justify-center h-full w-full">
        < CircularProgress />
      </div> : (data?.length ? (
        <>
          {data.map((place) => (
            <Tag type={EAllKey.Places} key={place.id} data={place} />
          ))}
          <div ref={sentinelRef} className="h-px" />
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