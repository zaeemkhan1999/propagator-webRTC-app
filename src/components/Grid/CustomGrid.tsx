import { Skeleton, Typography } from "@mui/material";
import { memo, useEffect, useMemo, useRef } from "react";
import "./Grid.css";
import { parsePostItems } from "./utils";
import Lottie from "lottie-react";
import NoDataImage from "../../app/utility/Nodata.json";
import { handleOnErrorImage } from "@/helper";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { IconPinFilled } from "@tabler/icons-react";

interface CustomGridProps {
  postData: {
    id?: number;
    postItemsString: string;
    post?: {
      id?: number;
      yourMind?: string;
    };
  }[];
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: Function;
  onClick: (id: number, index: number) => void;
  className?: string;
};

const layoutPattern = [
  "square", "square", "rectangle",
  "square", "square", "skip",
  "rectangle", "square", "square",
  "skip", "square", "square",
];

const CustomGrid = memo(({ postData = [], isFetching, fetchNextPage, onClick, className, hasNextPage }: CustomGridProps) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!isFetching && entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [isFetching, hasNextPage]);

  const mappingData = useMemo(() => {
    const result: any[] = [];
    let skippedItem: any = null;
    let skippedCount = 0;

    postData.forEach((curr, index) => {
      const parsedItems = parsePostItems(curr.postItemsString || "[]");
      const hasMedia = parsedItems?.length > 0;
      const layout = layoutPattern[(index + skippedCount) % layoutPattern.length];
      const nextLayout = layoutPattern[(index + skippedCount + 1) % layoutPattern.length];

      if (layout === "skip") {
        skippedItem = {
          ...curr,
          layout: nextLayout,
          height: nextLayout === "rectangle" ? "281px" : "140px",
          postItemsString: hasMedia ? parsedItems[0] : undefined,
        };
        skippedCount++;
        return;
      };

      if (skippedItem) {
        result.push(skippedItem);
        skippedItem = null;
      };

      result.push({
        ...curr,
        layout,
        height: layout === "rectangle" ? "281px" : "140px",
        postItemsString: hasMedia ? parsedItems[0] : undefined,
      });
    });

    if (skippedItem) {
      result.push(skippedItem);
      skippedItem = null;
    };

    return result;
  }, [postData]);

  return (
    <div
      className={`h-full relative pb-[56px] min-h-[100vh] dark:bg-gray-200 ${className || ""}`}
      style={{
        background: "white",
        display: "grid",
        gap: "1px",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(6, 140px)",
      }}
    >
      {!isFetching && !mappingData?.length
        ? <NoData />
        : mappingData.map((item, i) => {
          return item &&
            <div
              className="relative"
              key={`${item?.id}-${i}`}
              onClick={() => (item?.post?.id || item?.id) && onClick(item?.post?.id || item?.id!, i)}
              style={{
                overflow: "hidden",
                height: item.height,
                width: "100%",
                gridColumn: "span 1",
                gridRow: item.layout === "rectangle" ? "span 2" : "span 1",
              }}
            >
              <IconPinFilled className="absolute top-1 right-1" size={18} color="grey" />
              <RenderItem item={item} />
            </div>
        })}

      {isFetching && <Loader />}
      {!isFetching && <div ref={sentinelRef} className="h-px" />}
    </div>
  );
});

export default CustomGrid;

const RenderItem = memo(({ item }: any) => {
  const text = item?.post?.yourMind;

  if (item?.postItemsString || item?.postItemsString !== "[]") {
    const { ThumNail } = item?.postItemsString || {};

    return (
      <div className="h-full w-full">
        <LazyLoadImage
          src={ThumNail || ''}
          alt={text}
          className="h-full w-full object-cover"
          height={"100%"}
          width={"100%"}
          style={{
            objectFit: "cover",
            cursor: "pointer",
          }}
          onError={handleOnErrorImage}
        />
      </div>
    );
  };

  return (
    <div
      className="flex items-center text-xs justify-center h-full w-full text-white"
      style={{ cursor: "pointer", padding: "1rem" }}
    >
      {text || "Text Post"}
    </div>
  );
});

const Loader = () => {
  return (
    Array(12).fill("").map((_, i) => (
      <Skeleton
        key={i}
        variant="rectangular"
        width="auto"
        height="140px"
        className="bg-gray-400 opacity-[0.3]"
        animation="wave"
      />
    )));
};

const NoData = () => {
  return <div className="m-28">
    <Typography className="italic text-white text-center">No Data available</Typography>
    <Lottie
      loop
      animationData={NoDataImage}
      style={{ width: "200px", height: "200px", margin: "0 auto" }}
    />
  </div>
};
