import { memo, useEffect, useMemo, useRef, useState } from "react";
import { VideoJS } from "../Videojs";
import { PostData } from "../../types/Feed";
import useScreenDetector, {
  DaysAgo,
  isVideo,
  truncateString,
} from "../../app/utility/misc.helpers";
import {
  IconArrowLeft,
  IconArrowRight,
  IconDots,
  IconMessage,
  IconPlus,
  IconSpeakerphone,
} from "@tabler/icons-react";
import Title from "../Typography/Title";
import LazyLoadImg from "../LazyLoadImage";
import { useNavigate } from "react-router";
import MobileIcons from "./MobileIcons";
import Bookmark from "./Bookmark";
import PostLike from "./PostLike";
import { Box, Modal } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { MessageTypes } from "@/app/scene/Inbox/mutations/addMessage";
import Comment from "@/assets/icons/Comment";
import Share from "@/assets/icons/Share";

import UserAvatar from "../Stories/components/UserAvatar";
import ShareUIDrawer from "./ShareUIDrawer";
import MoreOptionDrawer from "./MoreOptionDrawer";
import CommentsSection from "./Comments";

interface PropTypes {
  post: PostData;
  onDelete: Function;
  userId?: number;
  setShowLikes?: Function;
  performAction?: 'comments' | '';
  dontShowPoster?: boolean;
  isSafari?: boolean;
};

const Feed = memo(({ post, onDelete, userId, setShowLikes, performAction, dontShowPoster, isSafari }: PropTypes) => {
  const navigate = useNavigate();
  const { isTablet, isMobile, isDesktop } = useScreenDetector();
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const layoutRef = useRef(post?.post?.aspectRatio);

  const [showComments, setShowComments] = useState(performAction === 'comments');
  const [showCaption, setShowCaption] = useState(false);
  const [clearMode, setClearMode] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [isMoreOptionsDrawerOpen, setIsMoreOptionsDrawerOpen] = useState<number | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const [showMore, setShowMore] = useState<boolean>(false);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const contentSrc = useRef(post?.postItemsString?.Content);

  const { ref: intersectionRef, inView, } = useInView({
    threshold: isSafari ? 0.02 : 0.76,
    triggerOnce: false,
  });

  const videoPlayerOptions = useMemo(() => {
    return !contentSrc.current
      ? null
      : {
        autoplay: false,
        controls: false,
        responsive: true,
        playsInline: true,
        enableSmoothSeeking: true,
        fluid: true,
        loop: true,
        preload: "auto",
        html5: {
          hls: {
            overrideNative: true,
            enableWorker: true,
            cacheEncryptionKeys: true,
          },
        },
        ...(!dontShowPoster && { poster: post?.postItemsString?.ThumNail }),
        sources: [
          {
            src: contentSrc.current,
            type: contentSrc.current.includes(".m3u8")
              ? "application/x-mpegURL"
              : "video/mp4"
          },
        ],
      };
  }, [post?.postItemsString?.Content, dontShowPoster]);

  useEffect(() => {
    if (contentType === "video" && playerRef?.current) {
      if (inView) {
        playerRef?.current.play().catch((err) => {
          console.warn("Auto-play prevented (useInView): ", err.message);
          //@ts-ignore
          playerRef?.current?.muted(true);
          setTimeout(() => {
            playerRef.current
              ?.play()
              .catch((error) => console.log("Auto-play second retry", error));
          }, 10);
        });
      } else {
        playerRef?.current?.pause();
      };
    };
  }, [inView, contentType]);

  useEffect(() => {
    const content = post?.postItemsString?.Content;
    if (content) {
      const type = isVideo(content)
        ? "video"
        : content.startsWith("http")
          ? "image"
          : "text";
      setContentType(type);
    } else {
      setContentType("text");
    }
  }, [post?.postItemsString?.Content]);

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
  };

  const handleCommentToggle = () => {
    setShowComments(!showComments);
    // if (navigator) {
    //   navigator.vibrate(50);
    // };
  };

  const handleShareToggle = () => {
    setShowShare(true);
    // if (navigator) {
    //   navigator.vibrate(50);
    // };
  };

  const handleUserProfile = (userId: number, isSelf: boolean) => {
    isSelf
      ? navigate(`/specter/profile`)
      : navigate(`/specter/userProfile/${userId}`);
  };

  useEffect(() => {
    const topMenu = document.getElementById("top-menu");
    if (topMenu) {
      topMenu.style.display = clearMode ? "none" : "";
    }
  }, [clearMode]);

  useEffect(() => {
    if (!inView) {
      showShare && setShowShare(prev => prev === true ? false : prev);
      performAction !== "comments" && showComments && setShowComments(prev => prev === true ? false : prev);
      !!isMoreOptionsDrawerOpen && setIsMoreOptionsDrawerOpen(prev => typeof prev === 'number' ? null : prev);
    }
  }, [showShare, showComments, isMoreOptionsDrawerOpen, inView, performAction]);

  const toggleShowMore = () => setShowMore(!showMore);

  const renderContent = () => {
    switch (contentType) {
      case "image":
        return (
          <div
            ref={(node) => {
              intersectionRef(node);
            }}
            className={`relative h-full w-full overflow-hidden ${(isMobile || isTablet) && (layoutRef.current === "1_1" || layoutRef.current === "4_5" || layoutRef.current === "3_4" || layoutRef.current === "16_9") ? "max-h-[350px]" : "h-full"}`}
          >
            <img
              src={contentSrc.current}
              alt="Post content"
              className={`w-full ${(layoutRef.current === "9_16" || layoutRef.current === "ORIGINAL") ? "h-full object-cover" : ""}`}
              style={{ width: "100%", height: "100%" }}
              onClick={handleOpen}
            />
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="image-modal"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  border: "2px solid #000",
                  maxHeight: "90vh",
                  overflowY: "auto",
                }}
              >
                <div className="absolute left-2 top-2 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black/60">
                  <IconPlus
                    onClick={handleClose}
                    className="rotate-45 text-white"
                  />
                </div>
                <LazyLoadImg
                  height={"100%"}
                  width={"100%"}
                  src={contentSrc.current}
                  alt="Full Post content"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Modal>
          </div>
        );
      case "video":
        return (
          <div
            className="h-full"
            ref={(node) => {
              intersectionRef(node);
            }}
          >
            <VideoJS
              playerRef={playerRef}
              options={videoPlayerOptions}
              onReady={handlePlayerReady}
            />
          </div>
        );
      case "text":
        return (
          <div
            className="relative h-full flex justify-center items-center overflow-y-auto flex-col"
            ref={(node) => {
              intersectionRef(node);
            }}>
            <p className="px-2 max-h-[400px] overflow-y-auto">{(post?.post?.yourMind?.length > 800 && !showMore)
              ? post?.post?.yourMind?.slice(0, 800) + "..."
              : post?.post?.yourMind}</p>
            {post?.post?.yourMind?.length > 800 && <span className="mt-3 me-1 ms-auto py-1 text-xs px-3 border border-gray-700 rounded-lg" onClick={toggleShowMore}>Show {!showMore ? "More" : "Less"}</span>}
          </div>
        );
      default:
        return "";
    };
  };

  return (
    <div
      className='relative flex h-dvh w-full snap-start snap-always flex-col justify-center overflow-hidden !text-white md:h-screen'
      style={{ background: post?.post?.bg ?? "#000", userSelect: "none" }}
      id={String(post?.post?.id)}
    >
      {(
        layoutRef.current === "1_1" ||
        layoutRef.current === "4_5" ||
        layoutRef.current === "3_4" ||
        layoutRef.current === "16_9") && (
          <>
            <div className="flex items-center justify-between p-3 md:flex">
              <div className="flex items-center gap-4">
                <UserAvatar
                  user={post?.post?.poster as any}
                  isSelf={userId === post?.post?.poster?.id}
                  size="7"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span onClick={() => handleUserProfile(post?.post?.poster?.id, userId === post?.post?.poster?.id)} className="cursor-pointer font-semibold">
                      {post?.post?.poster?.displayName}
                    </span>
                    {userId !== post?.post?.poster?.id &&
                      <button
                        onClick={() => handleUserProfile(post?.post?.poster?.id, userId === post?.post?.poster?.id)}
                        className="ml-2 rounded-[8px] border border-white bg-transparent p-[2px] px-[4px] text-[10px] font-bold text-white"
                      >
                        Follow
                      </button>}
                  </div>
                  {/* ---------- sponsored------- */}
                  {post?.needAds && <div className="flex items-center mt-1 gap-1 rounded-full bg-gray-200/20 text-white justify-center text-[10px] w-fit px-1">
                    <IconSpeakerphone size={13} />
                    <p>Sponsored</p>
                  </div>}
                </div>

              </div>
              <IconDots
                className="cursor-pointer"
                onClick={() => setIsMoreOptionsDrawerOpen(post?.post?.id)}
              />
            </div>
          </>)}

      <div
        className={`${isMoreOptionsDrawerOpen || showComments ? "blur-sm" : ""} 
        ${layoutRef.current === "1_1" ? "square-layout" : ""} 
        ${layoutRef.current === "4_5" ? "portrait-layout" : ""} 
        ${layoutRef.current === "3_4" ? "third-fourth" : ""} 
        ${layoutRef.current === "16_9" ? "landscape-layout" : ""}
        w-full ${(layoutRef.current === "9_16" || layoutRef.current === "ORIGINAL") ? "h-full" : "min-h-[200px] max-h-[480px] overflow-hidden"} md:max-h-[600px] `}
      >
        {renderContent()}
      </div>

      <div>
        {(layoutRef.current === "9_16" || layoutRef.current === "ORIGINAL")
          ? !clearMode
            ? <div className={`absolute bottom-[9%] z-[999] w-full lg:bottom-0`}>
              <div className="mr-2 flex h-full flex-col items-end gap-4 text-white w-fit ml-auto">
                <PostLike
                  size={32}
                  className="w-[30px] shadow-light-black"
                  post={post}
                  orientation="horizontal"
                  setShowLikes={setShowLikes}
                />
                <MobileIcons
                  icon={
                    <Comment
                      color={"white"}
                      strokeWidth={1.2}
                      size={27}
                      className="w-[30px] cursor-pointer shadow-light-black"
                    />
                  }
                  onclick={handleCommentToggle}
                  value={post?.commentCount}
                />
                <MobileIcons
                  icon={
                    <Share
                      color={"white"}
                      strokeWidth={1.2}
                      size={27}
                      onClick={handleShareToggle}
                      className="w-[30px] cursor-pointer shadow-light-black"
                    />
                  }
                />
                <MobileIcons
                  icon={
                    <IconDots
                      size={32}
                      strokeWidth={1.2}
                      className={`cursor-pointer shadow-light-black ${post?.needAds ? "rotate-0 " : "rotate-90"}`}
                      onClick={() => setIsMoreOptionsDrawerOpen(post?.post?.id)}
                    />
                  }
                />

              </div>

              <div
                style={{ bottom: isTablet || isMobile ? "20px" : "60px" }}
                className="absolute left-3 flex flex-col min-w-[250px] gap-2 -z-1"
              >
                <div className="flex items-center gap-3 w-fit">
                  <UserAvatar
                    user={post?.post?.poster as any}
                    isSelf={userId === post?.post?.poster?.id}
                    size="7"
                  />
                  <p onClick={() => handleUserProfile(post?.post?.poster?.id, userId === post?.post?.poster?.id)} className="!w-fit shadow-light-black max-w-[120px] text-white md:text-base">
                    {post?.post?.poster?.displayName || "User"}
                  </p>
                  {userId !== post?.post?.poster?.id &&
                    <button
                      onClick={() => handleUserProfile(post?.post?.poster?.id, userId === post?.post?.poster?.id)}
                      className="ml-2 shadow-light-black rounded-[8px] border border-white bg-transparent p-[2px] px-[4px] text-[11px] font-bold text-white"
                    >
                      Follow
                    </button>}
                </div>
                {/* ------- shop now ------ */}
                {post?.needAds &&
                  <div className="flex items-center gap-1 rounded-md bg-gray-300/30 text-white justify-between text-[14px] p-2 ">
                    <p>Shop Now</p>
                    <IconArrowRight size={20} />
                  </div>}

                {/* -------- title ------- */}
                <div className="cursor-pointer transition-all duration-700 ease-in-out max-w-[90%]">
                  <Title
                    onclick={() => setShowCaption((prev) => !prev)}
                    className=" text-xs text-white md:text-base"
                  >
                    {showCaption
                      ? post?.post?.yourMind
                      : truncateString(post?.post?.yourMind, 80)}
                  </Title>
                </div>
                {/* ---------- sponsored------- */}
                {post?.needAds &&
                  <div className="flex items-center gap-1 rounded-full bg-gray-400/20 text-white justify-center text-[11px] w-fit p-1 px-2">
                    <IconSpeakerphone size={15} />
                    <p>Sponsored</p>
                  </div>}
              </div>
            </div>
            : <IconDots
              size={25}
              className="absolute bottom-[80px] right-[20px] z-[999] w-[30px] rotate-90 cursor-pointer text-white md:bottom-12"
              onClick={() => setIsMoreOptionsDrawerOpen(post?.post?.id)}
            />
          : null}
      </div>

      {(layoutRef.current === "1_1" ||
        layoutRef.current === "4_5" ||
        layoutRef.current === "3_4" ||
        layoutRef.current === "16_9") &&
        <>
          {/* ------- shop now ------ */}
          {post?.needAds &&
            <div className="flex items-center gap-1 border-b bg-black text-white justify-between text-[14px] p-2 ">
              <p>Shop Now</p>
              <IconArrowLeft size={20} />
            </div>}

          <div className="p-3 ">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <PostLike
                  size={26}
                  className="w-[30px]"
                  post={post}
                  orientation="vertical"
                  setShowLikes={setShowLikes}
                />
                <MobileIcons
                  orientation="vertical"
                  icon={
                    <Comment
                      color={"white"}
                      size={25}
                      className="w-[30px] cursor-pointer"
                    />
                  }
                  onclick={handleCommentToggle}
                  value={post?.commentCount}
                />
                <MobileIcons
                  orientation="vertical"
                  icon={
                    <Share
                      color={"white"}
                      size={25}
                      onClick={handleShareToggle}
                      className="cursor-pointer text-white"
                    />
                  }
                  value={post?.shareCount}
                />
              </div>
              <Bookmark isSaved={post?.isSaved} />
            </div>

            {post?.postItemsString && (
              <div className="mt-2">
                <span
                  className="mr-2 font-semibold"
                  onClick={() => handleUserProfile(post?.post?.poster?.id, userId === post?.post?.poster?.id)}
                >
                  {post?.post?.poster?.displayName}
                </span>
                <span>{post?.post?.yourMind}</span>
              </div>
            )}
            {post?.commentCount > 0 && (
              <div
                className="text-dark mt-1 cursor-pointer"
                onClick={handleCommentToggle}
              >
                View all {post?.commentCount} comments
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500">
              {DaysAgo(post?.post?.createdDate)}
            </div>
          </div>
        </>}

      {isDesktop &&
        <div className="absolute right-4 top-4">
          <IconMessage
            onClick={() => {
              navigate("/specter/inbox")
              // if (navigator) {
              //   navigator.vibrate(50);
              // };
            }}
            className="text-white"
          />
        </div>}

      {showShare &&
        <ShareUIDrawer
          showShare={showShare}
          setShowShare={setShowShare}
          entityId={post?.post?.id}
          entityType={MessageTypes.POST}
        />}

      {isMoreOptionsDrawerOpen &&
        <MoreOptionDrawer
          post={post}
          isOpen={isMoreOptionsDrawerOpen}
          setIsOpen={setIsMoreOptionsDrawerOpen}
          clearMode={(state) => {
            setClearMode(state);
            setIsMoreOptionsDrawerOpen(null);
          }}
          onDelete={onDelete}
        />}

      {showComments &&
        <CommentsSection
          postId={post?.post?.id}
          postOwnerId={post?.post?.poster?.id}
          showComments={showComments}
          setShowComments={setShowComments}
        />}
    </div>
  );
});

export default Feed;
