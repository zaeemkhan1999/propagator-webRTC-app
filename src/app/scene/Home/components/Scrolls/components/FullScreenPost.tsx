import { ArticleItem } from "@/app/scene/Explore/queries/getExploreScrolls";
import { formatDateDisplay, isVideo } from "@/app/utility/misc.helpers";
import Comment from "@/assets/icons/Comment";
import Like from "@/assets/icons/Like";
import Share from "@/assets/icons/Share";
import { ScrollMoreOptions } from "@/components/Scroll";
import UserAvatar from "@/components/Stories/components/UserAvatar";
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import {
  IconArrowLeft,
  IconBookmark,
  IconDotsVertical,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface fullscreenprops {
  selectedFullPost: ArticleItem;
  setSelectedFullPost: any;
  scrollStringData: any;
  handleLike: (id: number, liked: boolean) => void;
  handleRemove: (id: number) => void;
  canRemove: boolean;
  setIsBottomSheetOpen: any;
  isBookmarked: boolean;
  handleBookmark: () => void;
  totalComments: number;
  userId: number;
}

const FullScreenPost = ({
  selectedFullPost,
  setSelectedFullPost,
  scrollStringData,
  handleLike,
  setIsBottomSheetOpen,
  isBookmarked,
  handleBookmark,
  totalComments,
  canRemove,
  handleRemove,
  userId
}: fullscreenprops) => {
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  const callHandleLike = () => {
    setSelectedFullPost((prev: ArticleItem) => {
      setAnimate(true);
      handleLike(prev.article.id, prev.isLiked);

      return prev.isLiked
        ? { ...prev, isLiked: false, likeCount: prev.likeCount - 1 }
        : { ...prev, isLiked: true, likeCount: prev.likeCount + 1 };
    });
  };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    };
  }, [animate]);

  return (
    <>
      <div className={`${!selectedFullPost ? "pt-12" : ""} z-50 h-screen w-full snap-y scroll snap-mandatory overflow-y-auto bg-gray-100 p-1 pb-20`}>
        <Card key={selectedFullPost?.article?.id}>
          <div className="p-2 md:p-4">
            <div>
              <CardHeader
                avatar={
                  <Box display="flex" alignItems="center" gap={4}>
                    <IconArrowLeft
                      className="cursor-pointer text-black hover:text-blue-600"
                      onClick={() => setSelectedFullPost(null)}
                    />
                    <UserAvatar
                      user={selectedFullPost?.article?.user}
                      isSelf={userId === selectedFullPost?.article?.user?.id}
                      size="9"
                    />
                  </Box>}
                action={
                  <IconButton aria-label="Menu" onClick={() => setIsMoreOptionsOpen(true)}>
                    <IconDotsVertical className="text-black" />
                  </IconButton>
                }
                title={<div>
                  <p className="font-bold text-gray-700">
                    {selectedFullPost.article.user.username}
                  </p>
                  <p className="text-[10px] text-gray-400">{formatDateDisplay(selectedFullPost.article.createdDate) || ""}</p>
                </div>}
              />

              <div className="flex flex-col items-start justify-between px-2 md:px-4">
                <div>
                  <h5 className="text-xl mb-2 cursor-pointer font-[600] text-gray-900 hover:text-blue-600">
                    {selectedFullPost?.article?.title}
                  </h5>
                  {selectedFullPost?.article?.subTitle && (
                    <p className="mb-4 text-gray-600 text-[15px]">
                      {selectedFullPost?.article?.subTitle}
                    </p>
                  )}

                  <p className="mt-3 pl-1 text-xs italic text-gray-600">
                    by {selectedFullPost?.article?.author || ""}
                  </p>

                  <div className="mb-6 ms-2 h-[auto] w-[auto] min-w-[134px] overflow-hidden">
                    {scrollStringData(selectedFullPost)
                      ?.map((data: any, i: number) => {
                        if (data?.ArticleItemType === 0) {
                          return <Typography
                            key={i}
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              fontSize: "14px",
                              marginTop: "20px",
                              wordBreak: "break-all"
                            }}
                          >
                            <div className="!text-[14px]"
                              dangerouslySetInnerHTML={{ __html: data?.Data }}
                            />
                          </Typography>
                        } else {
                          const isVideoType = isVideo(data?.Data);
                          return <CardMedia
                            key={i}
                            component={isVideoType ? "video" : "img"}
                            sx={{ height: "100%", width: "100%" }}
                            image={!isVideoType ? data?.Data : undefined}
                            src={isVideoType ? data?.Data : undefined}
                            controls={isVideoType}
                            autoPlay={isVideoType}
                            muted={isVideoType}
                            loop={isVideoType}
                            alt={selectedFullPost?.article?.title || ""}
                            className="my-4"
                          />
                        }
                      })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3 mt-6 flex justify-between">
              <div className="flex space-x-4">
                <div className="flex items-center gap-2">
                  <Like
                    onClick={callHandleLike}
                    className={`
                ${selectedFullPost?.isLiked ? "fill-current text-green-500 font-bold" : ""}
                 ${animate ? "animate-like" : ""}
                `}>
                  </Like>
                  <p className="text-[12px]">
                    {selectedFullPost?.likeCount}
                  </p>
                </div>
                <div onClick={() => setIsBottomSheetOpen(true)} className="flex items-center gap-2">
                  <Comment
                    className="cursor-pointer"
                    size={24}
                  />
                  <p className="text-[12px]">
                    {selectedFullPost?.commentCount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Share className="cursor-pointer" size={23}
                  />
                  <p className="text-[12px]">
                    {selectedFullPost?.shareCount}
                  </p>
                </div>
              </div>
              <IconBookmark
                className={`cursor-pointer ${isBookmarked ? "text-yellow-500 fill-current" : ""}`}
                size={25}
                strokeWidth={1.2}
                onClick={handleBookmark}
              />
            </div>

            {selectedFullPost?.commentCount
              ? <div
                className="text-dark mt-1 cursor-pointer"
                onClick={() => setIsBottomSheetOpen(true)}
              >
                View all {totalComments} comment(s)
              </div>
              : null}
          </div>
        </Card>
      </div>

      {isMoreOptionsOpen &&
        <ScrollMoreOptions
          isBottomSheetOpen={isMoreOptionsOpen}
          setIsBottomSheetOpen={setIsMoreOptionsOpen}
          scroll={selectedFullPost}
          canRemove={canRemove}
          handleRemove={handleRemove}
        />}
    </>
  );
};

export default FullScreenPost;
