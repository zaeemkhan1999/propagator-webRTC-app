import { useRef, useEffect, SetStateAction, Dispatch, memo, FC, useState, lazy, MouseEventHandler, useMemo } from "react";
import './post.css';
import { IconArrowLeft, IconDeviceAnalytics, IconDotsVertical, IconMessageCircle, IconPhotoShare, IconSend, IconTrash, IconVolume, IconVolumeOff } from "@tabler/icons-react";
import Bookmark from "@/components/Feed/Bookmark";
import useScreenDetector, { DaysAgo, truncateString } from "../../../../utility/misc.helpers";
import usrimg from '@/assets/images/avatar.png';
import { PostItem } from "../../PostTypes";
import { isImage, isVideo, Slice } from "@/helper";
import { Avatar, CircularProgress, IconButton, Pagination } from "@mui/material";
import LazyLoadImg from "@/components/LazyLoadImage";
import Title from "@/components/Typography/Title";
import { User } from "@/types/util.type";
import { IsPermissionEnable } from "@/app/utility/permission.helper";
import { permissionsENUM } from "@/constants/permissions";
import PostLike from "@/components/Feed/PostLike";
import { InView, useInView } from "react-intersection-observer";
import FeedSkeleton from "@/components/Skeleton/FeedSkeleton";
import { useNavigate } from "react-router";
import { MessageTypes } from "@/app/scene/Inbox/mutations/addMessage";
import { useCreateMyStory } from "@/components/Stories/mutation/createMyStory";
import Comment from "@/assets/icons/Comment";
import Share from "@/assets/icons/Share";
import useGetPosts, { PER_PAGE_COUNT } from "../../query/getPosts";
import useGetSavedPosts from "../../query/getSavedPosts";
import VideoJSPlayerSkin from "@/components/SkinVideoJs";
import VideoJsPlayer from "@/components/videoJsPlayer";

const BottomSheet = lazy(() => import("@/components/BottomSheet/BottomSheet"));
const CommentsSection = lazy(() => import("@/components/Feed/Comments"));
const ShareUIDrawer = lazy(() => import("@/components/Feed/ShareUIDrawer"));

interface PostProps {
  setShowPost: Dispatch<SetStateAction<boolean>>;
  isSuperAdmin: boolean;
  userData?: User;
  handleDelete?: MouseEventHandler<HTMLDivElement>;
  isBottomSheetOpen: PostItem | null;
  setIsBottomSheetOpen: Dispatch<SetStateAction<PostItem | null>>;
  deletingPost?: boolean;
  ref?: any;
  isSavedPosts?: boolean;
  isLongVideos?: boolean;
  showHeader?: boolean;
};

const ProfilePosts: FC<PostProps> = memo(({ isSavedPosts, showHeader = true, isLongVideos, setShowPost, isSuperAdmin, userData, handleDelete, isBottomSheetOpen, setIsBottomSheetOpen, deletingPost }) => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);

  const { isTablet, isMobile } = useScreenDetector();

  const [showShare, setShowShare] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [postIdAndPosterId, setPostIdAndPosterId] = useState<null | { postId: number, posterId: number }>(null)
  const [fullScreen, setFullScreen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCaption, setShowCaption] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<any>(null);
  const postId = searchParams.get("post");
  const page = searchParams.get("page");

  const { data, isLoading, getData, fetchSpecificPage, skip, total } = useGetPosts({
    where: {
      post: {
        isCreatedInGroup: { eq: false },
        posterId: { eq: userData?.id || null },
      },
    },
    order: [{ post: { createdDate: "DESC" } }],
  });

  const { data: savedData,
    isLoading: isLoadingSaved,
    getData: getSavedData,
    fetchSpecificPage: fetchSpecificSavedPage,
    skip: skipSaved,
    total: totalSaved } = useGetSavedPosts();

  useEffect(() => {
    !isSavedPosts
      ? getData(page ? ((+page - 1) * PER_PAGE_COUNT) : 0)
      : getSavedData();
  }, []);

  const postData: any[] = useMemo(() => {
    return (!isSavedPosts ? data : savedData)?.map(item => {
      if (item && (!isSavedPosts ? item.postItemsString : item?.post?.postItemsString) && item.post) {
        try {
          const parsedItems = JSON.parse(!isSavedPosts ? item?.postItemsString : item?.post?.postItemsString);
          const { Content, ThumNail }: { Content: string, ThumNail: string } = parsedItems?.length ? parsedItems[parsedItems?.length - 1] : {};
          return {
            Content,
            ThumNail,
            Post: item?.post,
            isLiked: item?.isLiked,
            isNotInterested: item?.isNotInterested,
            isSaved: item?.isSaved,
            isYourPost: item?.isYourPost,
            isViewed: item?.isViewed,
            commentCount: item?.commentCount,
            likeCount: item?.likeCount,
            shareCount: item?.shareCount,
            viewCount: item?.viewCount,
            layout: "",
            height: "",
          };
        } catch (error) {
          console.error("Error parsing postItemsString:", error);
          return [];
        };
      };
      return [];
    });
  }, [data, savedData]);

  const LongVideosPostData = postData.filter(item => item?.Content?.includes(".m3u8"));

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const newSkip = (page - 1) * PER_PAGE_COUNT;
    !isSavedPosts
      ? fetchSpecificPage(newSkip)
      : fetchSpecificSavedPage(newSkip);
  };

  const { inView } = useInView({
    threshold: 0.5,
    root: null,
    triggerOnce: false
  });

  const handleIntersection = (inView: boolean, index: number) => {
    const videoInstance = videoRefs.current[index];
    if (videoInstance) {
      if (inView) {
        videoInstance.play();
      } else {
        videoInstance.pause();
      }
    }
  };

  const deleteSearchParams = () => {
    searchParams.delete('post');
    searchParams.delete('page');
    window.history.replaceState({}, '', window.location.pathname);
  };

  useEffect(() => {
    if (postId && containerRef.current) {
      const postElement = containerRef.current.querySelector(`[data-post-id="${postId}"]`);
      if (postElement) {
        postElement.scrollIntoView({ block: "start" });
        if (postId && page) {
          deleteSearchParams();
        };
      };
    };
  }, [postId, postData, fullScreen]);

  const canDelete = IsPermissionEnable(permissionsENUM.DeleteEntities);

  const { createMyStory, loading: creatingStory } = useCreateMyStory();

  const handleCreatePostStory = () => {
    createMyStory({ postId: isBottomSheetOpen?.Post.id }, null, () => setIsBottomSheetOpen(null))
  };

  const renderContent = (item: PostItem, index: number) => {
    const layoutRef = item?.Post?.aspectRatio;

    const handleNormalScreenClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFullScreen(false);
    };

    switch (isVideo(item.Content) ? "video"
      : isImage(item.Content)
        ? "image"
        : "text") {
      case "image":
        return (
          <div className={`post-image-container ${fullScreen ? "h-screen" : "max-h-[600px]"} w-full overflow-hidden relative`}>
            <div className='flex p-3 md:flex items-center absolute justify-between bg-gradient-to-b from-black/10 to-transparent text-white w-full top-0 z-[99]'>
              <div className="flex items-center gap-2">
                {fullScreen && <>
                  <IconArrowLeft className="text-white cursor-pointer" onClick={handleNormalScreenClick} />
                  <div className="w-8 h-8 rounded-full mr-2 cursor-pointer overflow-hidden border-[1px] border-gray-400">
                    <LazyLoadImg width={"100%"} height={"100%"} className="w-full h-full object-cover" src={userData?.imageAddress || usrimg} alt="Profile" />
                  </div>
                  <span className="font-semibold cursor-pointer capitalize text-[12px]">{userData?.displayName}</span>
                </>}
              </div>
              {fullScreen && <IconDotsVertical size={20} className="cursor-pointer" onClick={() => setIsBottomSheetOpen(item)} />}
            </div>
            <LazyLoadImg
              className=" w-full h-full object-cover"
              height={`${fullScreen ? "100%" : "auto"}`}
              src={item.Content}
              alt="Post"
            />
            <div onClick={(e) => e.stopPropagation()} className={`absolute bottom-[35px] md:bottom-18 h-48 w-full z-10 ${fullScreen ? "block" : "hidden"}`}>
              <div className="flex flex-col gap-2 h-full items-center justify-center mr-3 text-white">
                <PostLike
                  post={item}
                  size={25}
                  className="w-[30px]"
                />
                <Comment size={25} onClick={() => setShowComments(true)} className="cursor-pointer w-[30px]" />
                <Share size={25} onClick={() => setShowShare(true)} className="cursor-pointer w-[30px]" />
              </div>
              <div className="flex items-center !text-gray-600 justify-between gap-2">
                <div>
                  <span className="text-[13px] mx-2">
                    {item?.likeCount} likes
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-[13px] mr-2">
                    {item?.commentCount} comments,
                    &nbsp;{item?.shareCount} shares,
                    &nbsp;{item?.viewCount} views
                  </span>
                </div>
              </div>
              <div style={{ bottom: isTablet || isMobile ? "30px" : "60px" }} className="absolute left-3 flex flex-col gap-2 ">
                <div className="flex items-center gap-1 w-fit" >
                  <div className="h-10 w-10 min-w-10 rounded-full border-[1px] border-gray-400 flex items-center justify-start">
                    {userData?.imageAddress && (
                      <Avatar>
                        <LazyLoadImg width={"100%"} height={"100%"} className="w-full h-full object-cover" src={userData?.imageAddress || usrimg} alt="Profile" />
                      </Avatar>
                    )}
                  </div>
                  <Title className="text-white md:text-base ms-2">{userData?.displayName}</Title>
                  <button className="border rounded-[8px] ml-2 border-white bg-transparent text-white font-bold text-[11px] p-[2px] px-[4px]">
                    Follow
                  </button>
                </div>
                <div className="transition-all ease-in-out duration-700 cursor-pointer">
                  <Title onclick={() => setShowCaption(prev => !prev)} className="text-white text-xs md:text-base pr-20">
                    {showCaption ? item.Post.yourMind : truncateString(item.Post.yourMind, 80)}
                  </Title>
                </div>
              </div>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="relative">
            <div className={`flex p-2 md:flex items-center bg-[#0f0f0f] text-white ${(fullScreen ? "absolute bg-gradient-to-b from-black/10 to-transparent" : "static")} justify-between  w-full top-0 z-[99]`}>
              <div className="flex items-center">
                {fullScreen && <IconArrowLeft className="text-white" onClick={handleNormalScreenClick} />}
                {!fullScreen && <>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full mr-2 cursor-pointer overflow-hidden border-[1px] border-gray-400">
                      <LazyLoadImg width={"100%"} height={"100%"} className="w-full h-full object-cover" src={userData?.imageAddress || usrimg} alt="Profile" />
                    </div>
                    <div>
                      <p className="font-semibold cursor-pointer text-[15px] capitalize">{userData?.displayName}</p>
                      <p className="text-gray-500 cursor-pointer text-[12px]">{item.Post ? DaysAgo(item?.Post?.createdDate) : ""}</p>
                    </div>
                  </div>
                </>}
              </div>
              <IconDotsVertical size={20} className="cursor-pointer" onClick={() => setIsBottomSheetOpen(item)} />
            </div>
            <InView
              key={`${item?.Post?.id}-${index}`}
              className="relative bg-black h-full"
              as="div"
              threshold={0.8}
              onChange={(inView) => handleIntersection(inView, index)}
            >
              {!item.Content.includes(".m3u8")
                ?
                <VideoJsPlayer
                  inView={inView}
                  fullScreen={setFullScreen}
                  key={`video-player-${item.Post.id}-${index}`}
                  src={item.Content}
                  playerRef={(instance) => (videoRefs.current[index] = instance)}
                  className={`w-full ${fullScreen ? "h-screen" : ""} min-h-[200px] ${layoutRef === "ORIGINAL" ? "horizontal-layout" : ""}
                ${layoutRef === "1_1" ? "square-layout" : ""}
                ${layoutRef === "4_5" ? "portrait-layout" : ""}
                ${layoutRef === "3_4" ? "third-fourth" : ""}
                ${layoutRef === "16_9" ? "landscape-layout" : ""} ${layoutRef === "9_16" ? "object-cover profile-reel" : "object-contain"} max-h-[87%] overflow-hidden`}
                  muted={isMuted}
                  autoplay={inView}
                  controls={false}
                  loop
                  playsInline
                  responsive
                  preload="none"
                />
                :
                <VideoJSPlayerSkin
                  inView={inView}
                  fullScreen={setFullScreen}
                  key={`video-player-${item.Post.id}-${index}`}
                  src={item.Content}
                  playerRef={(instance) => (videoRefs.current[index] = instance)}
                  className={`w-full ${fullScreen ? "h-screen" : ""} min-h-[200px] ${layoutRef === "ORIGINAL" ? "horizontal-layout" : ""}
                ${layoutRef === "1_1" ? "square-layout" : ""}
                ${layoutRef === "4_5" ? "portrait-layout" : ""}
                ${layoutRef === "3_4" ? "third-fourth" : ""}
                ${layoutRef === "16_9" ? "landscape-layout" : ""} ${layoutRef === "9_16" ? "object-cover profile-reel" : "object-contain"} max-h-[87%] overflow-hidden`}
                  muted={isMuted}
                  autoplay={inView}
                  controls={false}
                  loop
                  playsInline
                  responsive
                  preload="none"
                />}
              <div onClick={(e) => e.stopPropagation()} className={`absolute bottom-[35px] md:bottom-18 h-48 w-full z-10 ${fullScreen ? "block" : "hidden"}`}>
                <div className="flex flex-col gap-6 h-full items-end justify-center mr-3 text-white">
                  <PostLike
                    post={item}
                    size={25}

                  />
                  <IconMessageCircle onClick={() => setShowComments(true)} size={25} className="cursor-pointer" />
                  <IconSend size={25} onClick={() => setShowShare(true)} className="cursor-pointer" />
                </div>
                <div style={{ bottom: isTablet || isMobile ? "30px" : "60px" }} className="absolute left-3 flex flex-col gap-2 ">
                  <div className="flex items-center gap-1 w-fit" >
                    <div className="h-10 w-10 min-w-10 rounded-full border-[1px] border-gray-400 flex items-center justify-center">
                      {userData?.imageAddress && (
                        <Avatar>
                          <LazyLoadImg width={"100%"} height={"100%"} className="w-full h-full object-cover" src={userData?.imageAddress || usrimg} alt="Profile" />
                        </Avatar>
                      )}
                    </div>
                    <Title className="text-white md:text-base ms-2">{userData?.displayName}</Title>
                    <button className="border rounded-[8px] ml-2 border-white bg-transparent text-white font-bold text-[11px] p-[2px] px-[4px]">
                      Follow
                    </button>
                  </div>
                  <div className="transition-all ease-in-out duration-700 cursor-pointer">
                    <Title onclick={() => setShowCaption(prev => !prev)} className="text-white text-xs md:text-base pr-20">
                      {showCaption ? item.Post.yourMind : truncateString(item.Post.yourMind, 80)}
                    </Title>
                  </div>
                </div>
              </div>

              {!item.Content.includes(".m3u8") && <IconButton
                size="small"
                className="text-white bg-black absolute bottom-4 left-4 cursor-pointer z-50">
                {isMuted ? (
                  <IconVolumeOff
                    size={15}
                    onClick={(e) => { e.stopPropagation(); setIsMuted(false) }}
                  />
                ) : (
                  <IconVolume
                    size={15}
                    onClick={(e) => { e.stopPropagation(); setIsMuted(true) }}
                  />
                )}
              </IconButton>}
            </InView>
          </div>
        );
      case "text":
        return (
          <div className="post-text-container px-4">
            <div className='flex md:flex items-center py-3 justify-between bg-[#0f0f0f] text-white w-full '>
              <div className="flex items-center">
                {!fullScreen && <>
                  <div className="w-8 h-8 rounded-full mr-2 cursor-pointer overflow-hidden border-[1px] border-gray-400">
                    <LazyLoadImg width={"100%"} height={"100%"} className="w-full h-full object-cover" src={userData?.imageAddress || usrimg} alt="Profile" />
                  </div>
                  <span className="font-semibold cursor-pointer">{userData?.displayName}</span>
                </>}
              </div>
              <IconDotsVertical className="cursor-pointer" onClick={() => setIsBottomSheetOpen(item)} />
            </div>
            <p>{item?.Post?.yourMind}</p>
          </div>
        );
      default:
        return "Unsupported content type";
    }
  };

  return (
    <div ref={containerRef} className="post-container">
      {!fullScreen && showHeader &&
        <div className="post-header w-full z-[999] text-dark bg-[#0f0f0f] text-white p-2 flex justify-between items-center">
          <div className="post-user flex items-center">
            <IconArrowLeft className='cursor-pointer' onClick={() => {
              if (!isSavedPosts) {
                navigate(-1);
              } else {
                navigate('/specter/profile');
              }
              setShowPost(false);
              window.scrollTo(0, 0);
            }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold capitalize">{userData?.displayName}</span>
          </div>
          <div>
          </div>
        </div>}

      <div className={`${fullScreen ? "h-dvh" : "h-[calc(100dvh-40px)]"} overflow-y-auto ${fullScreen ? "snap-y snap-mandatory" : ""}`}>
        {(isLoading || isLoadingSaved)
          ? <FeedSkeleton />
          : (isLongVideos ? LongVideosPostData : postData)?.length
            ? (isLongVideos ? LongVideosPostData : postData)?.map((item, index) => (
              <div key={`${item?.Post?.id}-${index}`} data-post-id={item?.Post?.id} className={`post-item ${fullScreen ? "snap-start snap-always" : ""} `}>
                {renderContent(item, index)}
                <div className={`bg-[#0f0f0f] text-white p-2 ${fullScreen ? "hidden" : "block"}`}>
                  <div className="flex items-center justify-between ">
                    <div className="flex space-x-2 items-center !text-white">
                      <PostLike
                        post={item}
                        size={26}
                      />
                      <Comment
                        strokeWidth={1.2}
                        className="cursor-pointer"
                        size={25}
                        color='white'
                        onClick={() => {
                          setShowComments(true);
                          setPostIdAndPosterId({ postId: item?.Post?.id, posterId: item?.Post?.poster?.id });
                          if (navigator) { navigator.vibrate(50) }
                        }} />
                      <Share
                        strokeWidth={1.2}
                        size={25}
                        color='white'
                        onClick={() => { setShowShare(true); if (navigator) { navigator.vibrate(50) }; }} className="cursor-pointer w-[35px]" />
                    </div>
                    <Bookmark isSaved={item.isSaved} />
                  </div>

                  {item.Post && (
                    <div className="ml-2">
                      <span className="text-[13px]">{Slice(item.Post?.yourMind, 30)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[13px] mx-2">
                        {item?.likeCount} likes
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[13px] mr-2">
                        {item?.commentCount} comments,
                        &nbsp;{item?.shareCount} shares,
                        &nbsp;{item?.viewCount} views
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
            : <div className="text-center italic mt-10">No posts found.</div>}

        <Pagination
          count={Math.ceil((!isSavedPosts ? total : totalSaved) / PER_PAGE_COUNT)}
          page={Math.floor(((!isSavedPosts ? skip : skipSaved) / PER_PAGE_COUNT) + 1)}
          className="w-full bg-[#0f0f0f] py-1 text-center"
          onChange={handlePageChange}
          color="primary"
          disabled={isLoading || isLoadingSaved}
          sx={{
            "& ul": {
              justifyContent: "center",
            },
            "& ul li": {
              color: "white !important",
            },
            "& .MuiPaginationItem-root": {
              color: "white !important",
            }
          }}
        />
      </div>

      {showComments && postIdAndPosterId &&
        <CommentsSection
          postId={postIdAndPosterId?.postId}
          postOwnerId={postIdAndPosterId?.posterId}
          showComments={showComments}
          setShowComments={setShowComments}
        />}

      {showShare &&
        <ShareUIDrawer
          showShare={showShare}
          setShowShare={setShowShare}
          entityType={MessageTypes.POST}
          entityId={0}
        />}

      {!!isBottomSheetOpen && !(isLoading || isLoadingSaved) &&
        <BottomSheet isOpen={!!isBottomSheetOpen && !(isLoading || isLoadingSaved)} onClose={() => setIsBottomSheetOpen(null)} maxW="md">
          <div className='flex flex-col gap-3 pb-10'>
            <div
              onClick={() => navigate(`/specter/promotions`, { state: { props: { isPromote: true, postId: isBottomSheetOpen?.Post?.id } } })}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-blue-400">
              <IconDeviceAnalytics className="mr-2 inline" size={24} />
              <span className="text-base">Promote</span>
            </div>

            {(isBottomSheetOpen?.isYourPost || isSuperAdmin || canDelete)
              ? deletingPost
                ? <div className="text-center"><CircularProgress /></div>
                : <div onClick={handleDelete} className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-red-900">
                  <IconTrash className="mr-2 inline" size={24} />
                  <span className="text-base">Delete Post</span>
                </div>
              : null}

            {creatingStory
              ? <div className="text-center"><CircularProgress /></div>
              : <div onClick={handleCreatePostStory} className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-purple-500">
                <IconPhotoShare className="mr-2 inline" size={24} />
                <span className="text-base">Share to Story</span>
              </div>}
          </div>
        </BottomSheet>}
    </div>
  );
});

export default ProfilePosts;
