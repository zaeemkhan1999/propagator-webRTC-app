import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import { Typography } from "@mui/material";
import {
  IconBookmark,
  IconDotsVertical,
  IconEye,
  IconInfoTriangleFilled,
  IconLink,
  IconTrash,
  IconUserOff,
} from "@tabler/icons-react";
import { memo, useMemo, useState, lazy, useEffect } from "react";
import { ArticleItem } from "../../app/scene/Explore/queries/getExploreScrolls";
import NoData from "../../app/utility/Nodata.json";
import Lottie from "lottie-react";
import { DaysAgo } from "@/app/utility/misc.helpers";
import { useAddViewToArticle } from "@/app/scene/Home/components/Scrolls/mutations/viewScroll";
import Like from "@/assets/icons/Like";
import Comment from "@/assets/icons/Comment";
import Share from "@/assets/icons/Share";
import { enqueueSnackbar } from "notistack";
import UserAvatar from "../Stories/components/UserAvatar";

const BottomSheet = lazy(() => import("@/components/BottomSheet/BottomSheet"));

interface ScrollProps {
  setSelectedFullPost?: any;
  setSelectedFullScrollPost?: any;
  scroll: ArticleItem;
  handleLike: (id: number, liked: boolean) => void;
  canRemove: boolean;
  handleRemove: Function;
  userId: number;
};

const Scroll: React.FC<ScrollProps> = memo(({ setSelectedFullPost, scroll, canRemove, handleRemove, handleLike, userId }) => {

  const addViewMutation = useAddViewToArticle();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [likedData, setLikedData] = useState<{ isLiked: boolean, count: number }>({ isLiked: scroll.isLiked, count: scroll?.likeCount });
  const [animate, setAnimate] = useState<string>("");

  const stringData = useMemo(() => {
    try {
      return (JSON.parse(scroll?.articleItemsString as string) || []);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.error("Original string:", scroll?.articleItemsString);
      return [];
    }
  }, [scroll]);

  const callHandleLike = () => {

    setLikedData(prev => {
      setAnimate("like");
      handleLike(scroll.article.id, prev.isLiked);

      return prev.isLiked
        ? { isLiked: false, count: prev.count - 1 }
        : { isLiked: true, count: prev.count + 1 };
    });
    if (navigator) {
      navigator.vibrate(50);
    }
  };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(""), 300);
      return () => clearTimeout(timer);
    };
  }, [animate]);

  if (!scroll) return;

  return (
    <div className="pb-1">
      <Card>
        <CardHeader
          avatar={<UserAvatar
            user={scroll?.article?.user}
            isSelf={userId === scroll?.article?.user?.id}
            size="9"
          />}
          action={
            <IconButton
              aria-label="settings"
              onClick={() => setIsBottomSheetOpen(true)}
            >
              <IconDotsVertical className="text-black" />
            </IconButton>
          }
          title={<div>
            <p className="font-bold text-gray-700">
              {scroll?.article?.user?.username}
            </p>
            <p className="text-[10px] font-[500] text-gray-400">{DaysAgo(scroll?.article?.createdDate) || ""}</p>
          </div>}
        />
        <div className="flex items-start justify-between px-4">
          <div>
            <h5
              onClick={() => {
                setSelectedFullPost?.(scroll);
                addViewMutation.mutate({ articleId: scroll?.article?.id });
              }}
              className="text-lg mb-1 cursor-pointer font-[600] text-gray-900 hover:text-blue-600"
            >
              {scroll?.article?.title}
            </h5>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "15px",
              }}
              className="text-gray-700 italic"
            >
              {scroll.article.subTitle || "Default subtitle"}
            </Typography>

            <p className=" text-[10px] text-gray-500 font-regular">
              by {scroll.article.author || ""}
            </p>
          </div>

          <div className="ms-2 h-[100px] w-[100px] min-w-[100px] overflow-hidden ">
            {stringData?.map((data: any, i: number) => {
              let imageSrc = "";
              try {
                if (typeof data?.Data === "string") {
                  imageSrc = data?.Data;
                } else {
                  console.error(
                    "Data field is not a valid string:",
                    data?.Data,
                  );
                }
              } catch (error) {
                console.error("Error parsing data:", error);
                console.error("Invalid data:", data?.Data);
                imageSrc = "";
              }

              return data?.ArticleItemType === 1 ? (
                <CardMedia
                  key={i}
                  component="img"
                  sx={{
                    height: "100%",
                    width: "100%",
                    border: "1px solid grey",
                    borderRadius: 0
                  }}
                  image={imageSrc}
                  alt="Media Image"
                />
              ) : (
                <Lottie
                  key={i}
                  loop={false}
                  animationData={NoData}
                  style={{
                    width: "130px",
                    height: "120px",
                    margin: "0 auto",
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center text-gray-600 justify-end px-4 py-2 pt-4">
          <div >
            <p className={`cursor-pointer text-[12px] font-light ms-2`}>
              {likedData.count} <span>
                Likes,
              </span>
            </p>
          </div>
          <div className="flex items-center">
            <p className="cursor-pointer text-[12px] font-light  ms-1">
              {scroll?.commentCount} Comments,
            </p>

            <p className="text-[12px] font-light ms-1">
              {scroll?.shareCount} Shares,
            </p>

            <p className="text-[12px] font-light ms-1">{scroll?.viewCount} views</p>
          </div>
        </div>
        <div className="p-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Like
                onClick={callHandleLike}
                className={`
                ${likedData.isLiked ? "fill-current text-green-500 font-bold" : ""}
                 ${animate === "like" ? "animate-like" : ""}
                `}>
              </Like>
              <div className={`
                 ${animate === "comment" ? "animate-like" : ""}
                `} onClick={() => {
                  setAnimate("comment");
                  setSelectedFullPost?.(scroll);
                  addViewMutation.mutate({ articleId: scroll?.article?.id });
                  if (navigator) {
                    navigator.vibrate(50);
                  }
                }}>
                <Comment size={22} />
              </div>
              <div>
                <Share strokeWidth={1.7} size={22} />
              </div>
            </div>
            <div>
              <IconBookmark strokeWidth={1.7} size={22} />
            </div>
          </div>
        </div>
      </Card >

      {isBottomSheetOpen &&
        <ScrollMoreOptions
          isBottomSheetOpen={isBottomSheetOpen}
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          scroll={scroll}
          canRemove={canRemove}
          handleRemove={handleRemove}
        />}
    </div>
  );
});

export default Scroll;

interface ScrollMoreOptionsProps {
  isBottomSheetOpen?: any;
  setIsBottomSheetOpen?: any;
  scroll: ArticleItem;
  canRemove: boolean;
  handleRemove: Function;
};

export const ScrollMoreOptions = memo(({ isBottomSheetOpen, setIsBottomSheetOpen, canRemove, handleRemove, scroll }: ScrollMoreOptionsProps) => {

  const [copied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    if (isBottomSheetOpen && scroll?.article?.id) {
      try {
        const contentLink = `${window.location.origin}/specter/view/scroll/${scroll?.article?.id}`;
        navigator.clipboard.writeText(contentLink).then(() => {
          setIsCopied(true);
          enqueueSnackbar("Link copied", { variant: "success", autoHideDuration: 2000, anchorOrigin: { horizontal: "left", vertical: "top" } });
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        });
      } catch (error) {
        console.error('Error copying link', error);
      }
    }
  };

  return <BottomSheet
    isOpen={isBottomSheetOpen}
    onClose={() => setIsBottomSheetOpen(false)}
    maxW="md"
    position="fixed"
  >
    <div className="py-2 text-black1">
      <div className="mb-4 flex justify-around border-b border-gray-200 pb-4">
        <div className="flex flex-col items-center">
          <IconBookmark size={24} className="mb-1 text-blue2" />
          <span className="text-xs text-blue2">Save</span>
        </div>
        <div className="flex flex-col items-center" onClick={handleCopyLink}>
          <IconLink size={24} className="mb-1 text-blue2" />
          <span className="text-xs text-blue2">{copied ? "Copied" : "Get Link"}</span>
        </div>
        <div className="flex flex-col items-center">
          <IconInfoTriangleFilled size={24} className="mb-1 text-blue2" />
          <span className="text-xs text-blue2">Report</span>
        </div>
      </div>
      <div className="cursor-pointer px-4 py-3 hover:bg-gray-100">
        <IconEye className="mr-2 inline text-blue2" size={24} />
        <span className="text-base text-blue2">Not Intersted</span>
      </div>
      <div className="flex cursor-pointer items-center px-4 py-3 hover:bg-gray-100">
        <IconUserOff className="mr-2 inline text-blue2" size={24} />
        <span className="text-base text-blue2">Block</span>
      </div>
      {(canRemove || scroll?.isYourArticle) &&
        <div
          onClick={() => {
            handleRemove(scroll?.article?.id);
            setIsBottomSheetOpen(false);
          }}
          className="flex cursor-pointer items-center px-4 py-3 hover:bg-gray-100 text-red-600">
          <IconTrash className="mr-2 inline" size={24} />
          <span className="text-base">Delete</span>
        </div>}
    </div>
  </BottomSheet>
});
