import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@mui/material";
import LazyLoadImg from "../LazyLoadImage";
import "./Grid.css";
import { IconVideo } from "@tabler/icons-react";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { Post_GetExplorePostsResultPostItemsString } from "../../app/scene/Explore/queries/getExplorePosts";
import { parsePostItems } from "./utils";
import { isVideo } from "@/helper";

const styles = {
  imageGallery: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2px",
    position: "relative",
  },
  imageContainer: {
    position: "relative",
    maxHeight: "140px",
    minHeight: "140px",
  },
  videoContainer: {
    position: "relative",
    maxHeight: "140px",
    minHeight: "140px",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageCaption: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    padding: "8px",
    fontSize: "14px",
  },
  noImages: {
    textAlign: "center",
    padding: "16px",
  },
  app: {
    maxWidth: "1140px",
    margin: "0 auto",
  },
  appTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "16px 0",
  },
};

const getLayoutStyle = (layout: any) => {
  if (layout === undefined) {
    return {
      gridColumn: "span 2",
      gridRow: "span 2",
      position: "relative" as const,
    };
  }
  const [col, row] = layout?.split(" ") ?? [];
  return {
    gridColumn: col === "col-1" ? "span 1" : "span 2",
    gridRow: row === "row-1" ? "span 1" : "span 2",
    position: "relative" as const,
  };
};

interface Props {
  postData: {
    id: number;
    postItemsString: string;
  }[];
  isFetching: boolean;
  fetchNextPage: UseInfiniteQueryResult["fetchNextPage"];
  mediaType: "video" | "photos" | "all";
  onClick: (item: any, index: number) => void;
  scrollRef?: React.Ref<HTMLDivElement>;
}

const ThumbnailGrid = memo(
  ({ postData = [], isFetching, fetchNextPage, mediaType, onClick }: Props) => {
    const [videoErrors, setVideoErrors] = useState({});
    const [mutedVideos, setMutedVideos] = useState<Record<string, any>>({});
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
        },
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

    const handleVolumeToggle = (index: any) => {
      setMutedVideos((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };

    const handleVideoError = (index: any) => {
      setVideoErrors((prevErrors) => ({
        ...prevErrors,
        [index]: true,
      }));
    };

    const data = useMemo(
      () =>
        postData.reduce(
          (acc, curr, index) => {
            if (parsePostItems(curr.postItemsString)?.length) {
              acc.push({
                ...curr,
                layout: (index + 1) % 3 === 0 ? "col-1 row-1" : "col-1 row-1",
                height: (index + 1) % 3 === 0 ? "100%" : "140px",
                postItemsString: parsePostItems(curr?.postItemsString)?.[0],
              });
            }

            return acc;
          },
          [] as {
            layout: string;
            height: string;
            postItemsString: Post_GetExplorePostsResultPostItemsString;
            id: number;
          }[],
        ),
      [postData],
    );

    return (
      <div className="normal-grid h-full min-h-[100vh] bg-black md:h-screen">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2px",
            position: "relative",
          }}
        >
          {data.map((item, index: number) => {
            const isMuted =
              mutedVideos[index] !== undefined ? mutedVideos[index] : true;
            const isVideoData = isVideo(item.postItemsString.Content);

            if (mediaType === "video" && isVideoData) {
              return (
                <div
                  key={`${item?.id}-${index}`}
                  style={{
                    ...styles.videoContainer,
                    ...getLayoutStyle(item?.layout),
                  }}
                  onClick={() => onClick(item, index)}
                >
                  <video
                    id="videoElement"
                    src={item?.postItemsString?.Content}
                    style={{
                      cursor: "pointer",
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    poster={item?.postItemsString?.ThumNail}
                    muted={isMuted}
                    autoPlay={false}
                    playsInline
                    onError={() =>
                      handleVideoError(item?.postItemsString?.ThumNail)
                    }
                  >
                    Your browser does not support the video tag.
                  </video>
                  <IconVideo size={17} className="absolute right-2 top-1 text-white" />
                </div>
              );
            } else if (mediaType === "photos" && !isVideoData) {
              return (
                <div key={`${item?.id}-${index}`}>
                  <div
                    style={{
                      ...styles.imageContainer,
                      ...getLayoutStyle(item?.layout),
                    }}
                    onClick={() => onClick(item, index)}
                  >
                    <img
                      src={item?.postItemsString?.ThumNail}
                      alt="image"
                      className="h-[140px] w-full object-cover"
                    />
                  </div>
                </div>
              );
            } else {
              if (isVideoData) {
                <div
                  key={`${item?.id}-${index}`}
                  style={{
                    ...styles.videoContainer,
                    ...getLayoutStyle(item?.layout),
                  }}
                  onClick={() => onClick(item, index)}
                >
                  <video
                    src={item?.postItemsString?.Content}
                    style={{
                      cursor: "pointer",
                      height: "100%",
                      width: "100%",
                    }}
                    poster={item?.postItemsString?.ThumNail}
                    muted
                    autoPlay={false}
                    playsInline
                    onError={() =>
                      handleVideoError(item?.postItemsString?.ThumNail)
                    }
                    onClick={(e) => {
                      e.currentTarget.muted = !e.currentTarget.muted;
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <IconVideo
                    size={20}
                    className="absolute right-2 top-2 text-white"
                  />
                </div>;
              } else {
                <div
                  key={`${item?.id}-${index}`}
                  style={{
                    ...styles.imageContainer,
                    ...getLayoutStyle(item?.layout),
                  }}
                >
                  <LazyLoadImg
                    src={item?.postItemsString?.Content}
                    className="h-full w-full object-cover"
                    alt="image"
                    height={"100%"}
                    width={"100%"}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>;
              }
            }
          })}
          <div ref={sentinelRef} className="h-px" />

          {isFetching &&
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="auto"
                height="140px"
                className="bg-gray-100 opacity-[0.3]"
                animation="wave"
              />
            ))}
        </div>
      </div>
    );
  },
);

export default ThumbnailGrid;
