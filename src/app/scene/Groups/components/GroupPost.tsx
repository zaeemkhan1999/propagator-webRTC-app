import { useRef, useEffect, memo, useState, lazy, useMemo } from "react";
import "../../Profile/components/ProfilePosts/post.css";
import { IconDotsVertical, IconPhotoShare, IconPlus, IconTrash } from "@tabler/icons-react";
import useScreenDetector, { DaysAgo } from "@/app/utility/misc.helpers";
import { isImage, isVideo } from "@/helper";
import { Box, CircularProgress, Modal } from "@mui/material";
import LazyLoadImg from "@/components/LazyLoadImage";
import Bookmark from "@/components/Feed/Bookmark";
import { DiscussionItem } from "../queries/getGroupDiscussion.query";
import { useNavigate } from "react-router";
import VideoPlayer from "@/components/Videojs";
import { parsePostItems } from "@/components/Grid/utils";
import PostLike from "@/components/Feed/PostLike";
import { MessageTypes } from "../../Inbox/mutations/addMessage";
import { useCreateMyStory } from "@/components/Stories/mutation/createMyStory";
import Comment from "@/assets/icons/Comment";
import Share from "@/assets/icons/Share";
import useIsSuperAdminAndIsProfessionalAccount from "@/hooks/useIsSuperAdminAndIsProfessionalAccount";
import { useDeletePost } from "../../Admin/mutations/deletePost";
import { IsPermissionEnable } from "@/app/utility/permission.helper";
import { permissionsENUM } from "@/constants/permissions";
import UserAvatar from "@/components/Stories/components/UserAvatar";

const ShareUIDrawer = lazy(() => import("@/components/Feed/ShareUIDrawer"));
const CommentsSection = lazy(() => import("@/components/Feed/Comments"));
const BottomSheet = lazy(() => import("@/components/BottomSheet/BottomSheet"));

interface Props {
    post: DiscussionItem;
    onDelete: Function;
    userId?: number;
};

const GroupPost: React.FC<Props> = memo(({ post, onDelete, userId }) => {
    const navigate = useNavigate();

    const [showComments, setShowComments] = useState(false);
    const [clearMode, setClearMode] = useState<boolean | false>(false);
    const [showShare, setShowShare] = useState<boolean>(false);
    const [isMoreOptionsDrawerOpen, setIsMoreOptionsDrawerOpen] = useState<number | null>(null);
    const [contentType, setContentType] = useState<string | null>(null);
    const playerRef = useRef<HTMLVideoElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const { isTablet, isMobile } = useScreenDetector();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const contentSrc = useRef(parsePostItems(post?.post?.postItemsString)[0]?.Content);

    useEffect(() => {
        const content = contentSrc.current;

        if (content) {
            const type = isVideo(content) ? 'video' : isImage(content) ? "image" : 'text';
            setContentType(type);
        } else {
            setContentType("text");
        }

        if (content !== contentSrc.current) {
            contentSrc.current = content;
        }
    }, [contentSrc.current]);

    const videoJsOptions = useMemo(() => {
        if (!contentSrc.current) return null;

        return {
            autoplay: false,
            controls: false,
            responsive: true,
            playsInline: true,
            enableSmoothSeeking: true,
            fluid: true,
            sources: [
                {
                    src: contentSrc.current || '',
                    type: contentSrc.current.includes(".m3u8")
                        ? "application/x-mpegURL"
                        : "video/mp4",
                },
            ],
            loop: true,
        };
    }, [contentSrc.current]);

    const handleVideoPlayback = (entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
            playerRef.current?.play();
        } else {
            playerRef.current?.pause();
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => handleVideoPlayback(entry),
            { threshold: 0.3 }
        );

        const currentContentRef = contentRef.current;
        if (currentContentRef) {
            observer.observe(currentContentRef);
        };

        return () => {
            if (currentContentRef) {
                observer.unobserve(currentContentRef);
            }
        };
    }, [contentType]);

    const handlePlayerReady = (player: any) => {
        playerRef.current = player;
        player.on("loadedmetadata", () => {
            const observer = new IntersectionObserver(([entry]) => handleVideoPlayback(entry), { threshold: 0.3 });
            if (contentRef.current) {
                observer.observe(contentRef.current);
            }
        });
        player.on("waiting", () => { });
        player.on("dispose", () => { });
    };

    const layoutRef = useRef(post?.post?.aspectRatio);

    const handleCommentToggle = () => setShowComments(!showComments);

    const handleUserProfile = () => navigate(`/specter/${post?.post?.poster?.id! === userId ? "profile" : `userProfile/${post?.post?.poster?.id!}`}`);

    const renderContent = () => {
        switch (contentType) {
            case "image":
                return (
                    <div className={`${(isMobile || isTablet)} max-h-[600px] overflow-hidden w-full`}>
                        <LazyLoadImg
                            height={"100%"}
                            width={"100%"}
                            src={contentSrc.current}
                            alt="Post content"
                            className={`w-full ${layoutRef.current === "9_6" && "h-full object-cover"}`}
                            onClick={handleOpen}
                        />
                        <Modal open={open} onClose={handleClose} aria-labelledby="image-modal">
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    border: '2px solid #000',
                                    maxHeight: "90vh",
                                    overflowY: "auto"
                                }}
                            >
                                <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center absolute top-2 left-2 z-50">
                                    <IconPlus onClick={handleClose} className="rotate-45 text-white " />
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
                                        objectFit: "contain"
                                    }}
                                />
                            </Box>
                        </Modal>
                    </div>
                );
            case "video":
                return (
                    <div className="relative" ref={contentRef}>
                        <VideoPlayer
                            seekbarPosition={"-7px"}
                            playerRef={playerRef}
                            options={videoJsOptions}
                            onReady={handlePlayerReady}
                            notInterested={post.isNotInterested}
                            controls={layoutRef.current === "16_9" ? true : false}
                        />
                    </div>
                );
            case "text":
                return <p className="px-2">{post?.post?.yourMind}</p>;
            default:
                return;
        }
    };

    useEffect(() => {
        const topMenu = document.getElementById("top-menu");
        if (topMenu) {
            topMenu.style.display = clearMode ? "none" : "";
        }
    }, [clearMode]);

    const { createMyStory, loading: creatingStory } = useCreateMyStory();

    const handleCreatePostStory = () => {
        isMoreOptionsDrawerOpen &&
            createMyStory({ postId: isMoreOptionsDrawerOpen }, null, () => setIsMoreOptionsDrawerOpen(null))
    };

    const [isSuperAdmin] = useIsSuperAdminAndIsProfessionalAccount();

    const { deletePost, loading: deletingPost } = useDeletePost();

    const handleDelete = () => {
        isMoreOptionsDrawerOpen && deletePost({ entityId: isMoreOptionsDrawerOpen }, () => {
            onDelete();
            setIsMoreOptionsDrawerOpen(null);
        });
    };

    const hasPermission = IsPermissionEnable(permissionsENUM.DeleteEntities);

    if (!post) return null;

    return (
        <div className={`!bg-[#090909] text-white flex flex-col justify-center relative h-full md:h-screen w-full overflow-hidden`} id={String(post?.post?.id)}>
            <div className='flex p-3 pt-2 md:flex items-center justify-between'>
                <div className="flex items-center gap-2">
                    <UserAvatar
                        user={post?.post?.poster as any}
                        isSelf={userId === post?.post?.poster?.id}
                        size="9"
                    />
                    <div className="flex flex-col">
                        <span onClick={handleUserProfile} className="font-semibold cursor-pointer text-dark">{post?.post?.poster?.displayName}</span>
                        <span className="text-xs text-gray-500">{DaysAgo(post?.post?.postedAt)}</span>
                    </div>
                    {userId !== post?.post?.poster?.id &&
                        <button onClick={handleUserProfile} className="border rounded-[8px] border-blue-500 bg-transparent text-blue-500 font-bold text-[10px] p-[2px] px-[4px]">
                            Follow
                        </button>}
                </div>
                <IconDotsVertical className="cursor-pointer" onClick={() => setIsMoreOptionsDrawerOpen(post?.post?.id!)} />
            </div>

            <div className={`${isMoreOptionsDrawerOpen || showComments ? "blur-sm" : ""} 
                    ${layoutRef.current === "ORIGINAL" ? "horizontal-layout" : ""} 
                    ${layoutRef.current === "1_1" ? "square-layout" : ""} 
                    ${layoutRef.current === "4_5" ? "portrait-layout" : ""} 
                    ${layoutRef.current === "3_4" ? "third-fourth" : ""} 
                    ${layoutRef.current === "16_9" ? "landscape-layout" : ""}
                    w-full ${layoutRef.current === "9_16" ? "h-full" : "min-h-[200px] max-h-[600px] overflow-hidden"} md:max-h-[600px]`}>
                {renderContent()}
            </div>

            <div className="p-2">
                <div className="flex items-center justify-between ">
                    <div className="flex space-x-2 items-center !text-white">
                        <PostLike
                            post={post}
                            size={26}
                        />
                        <Comment color='white' strokeWidth={1.2} size={25} onClick={handleCommentToggle} className="cursor-pointer w-[35px]" />
                        <Share color='white' strokeWidth={1.2} size={25} onClick={() => setShowShare(true)} className="cursor-pointer w-[35px]" />
                    </div>
                    <Bookmark isSaved={post?.isSaved} />
                </div>

                {post?.post?.postItemsString && (
                    <div className="mt-2 ml-2">
                        {post.post.yourMind}
                    </div>
                )}

                <div className="flex items-center justify-between gap-2">
                    <div>
                        <span className="text-[13px] mx-2">
                            {post?.likeCount} likes
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-[13px] mr-2">
                            {post?.commentCount} comments,
                            &nbsp;{post?.shareCount} shares,
                            &nbsp;{post?.viewCount} views
                        </span>
                    </div>
                </div>
            </div>

            {showShare &&
                <ShareUIDrawer
                    showShare={showShare}
                    setShowShare={setShowShare}
                    entityType={MessageTypes.POST}
                    entityId={post?.post?.id!}
                />}

            {showComments &&
                <CommentsSection
                    commentsPosition={"fixed"}
                    postId={post?.post?.id!}
                    postOwnerId={post?.post?.poster?.id!}
                    showComments={showComments}
                    setShowComments={setShowComments}
                />}

            {isMoreOptionsDrawerOpen &&
                <BottomSheet position="fixed" isOpen={!!isMoreOptionsDrawerOpen} onClose={() => setIsMoreOptionsDrawerOpen(null)} maxW="md">
                    <div className="py-2 text-black1">
                        {creatingStory
                            ? <div className="text-center"><CircularProgress /></div>
                            : <div onClick={handleCreatePostStory} className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-purple-500 mb-5">
                                <IconPhotoShare className="mr-2 inline" size={24} />
                                <span className="text-base">Share to Story</span>
                            </div>}

                        {(post?.isYours || isSuperAdmin || hasPermission)
                            ? deletingPost
                                ? <div className="text-center"><CircularProgress /></div>
                                : <div onClick={handleDelete} className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-red-900">
                                    <IconTrash className="mr-2 inline" size={24} />
                                    <span className="text-base">Delete</span>
                                </div>
                            : null}
                    </div>
                </BottomSheet>}
        </div>
    );
});

export default GroupPost;
