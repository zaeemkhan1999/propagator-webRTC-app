import { lazy, memo, useEffect, useRef, useState } from 'react';
import { Avatar, CircularProgress, Dialog, IconButton, Typography } from '@mui/material';
import { MyStory } from '../queries/getMyStories';
import { StoryTypes } from '../mutation/createMyStory';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useLikeUnlikeStory } from '../mutation/likeUnlikeStory';
import { useRemoveStory } from '../mutation/removeStory';
import { DaysAgo } from '@/app/utility/misc.helpers';
import { UserForStory } from '..';
import { useCreateComment } from '../mutation/createComment';
import { useGetStoryComments } from '../queries/getStoryComments';
import { useGetStoryViewers } from '../queries/getStoryViewers';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateStorySeen } from '../mutation/createSeen';
import { MessageTypes } from '@/app/scene/Inbox/mutations/addMessage';
import { parsePostItems } from '@/components/Grid/utils';
import { UserStory } from '../queries/getUserStories';
import { isImage, isVideo } from '@/helper';
import ArrowLeft from '@/assets/icons/ArrowLeft';
import Trash from '@/assets/icons/IconTrash';
import DotsVertical from '@/assets/icons/DotsMenu';
import Heart from '@/assets/icons/Heart';
import HeartFilled from '@/assets/icons/HeartFilled';
import PlayerPlayIcon from '@/assets/icons/Play';
import PlayerPauseIcon from '@/assets/icons/Pause';
import EyeIcon from '@/assets/icons/Eye';
import Share from '@/assets/icons/Share';
import PencilCheckIcon from '@/assets/icons/PencilCheck';
import VolumeIcon from '@/assets/icons/Unmute';
import VolumeOffIcon from '@/assets/icons/Mute';
import ArrowNarrowRightIcon from '@/assets/icons/ArrowRight';
import Comment from '@/assets/icons/Comment';
import { IconArrowLeft, IconSend2 } from '@tabler/icons-react';

const BottomSheet = lazy(() => import('@/components/BottomSheet/BottomSheet'));
const ShareUIDrawer = lazy(() => import('@/components/Feed/ShareUIDrawer'));

interface StoryViewerProps {
    stories: any[];
    setStories: Function;
    isOpen: boolean;
    onClose: Function;
    refetchStories?: Function;
    user: UserForStory;
    isMyStories: boolean;
    handleViewPrevOrNextUserStory?: Function;
};

const StoryViewer = memo(({ stories, setStories, user, isOpen, onClose, refetchStories, isMyStories, handleViewPrevOrNextUserStory }: StoryViewerProps) => {
    const navigate = useNavigate();
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [showMoreOptions, setShowMoreOptions] = useState<MyStory | null>(null);
    const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
    const [showViewersOrCommentsDialog, setShowViewersOrCommentsDialog] = useState<"" | "viewers" | "comments">("");
    const [isLiked, setIsLiked] = useState<boolean>(stories[currentMediaIndex]?.likedByCurrentUser as boolean || false);
    const [commentText, setCommentText] = useState<string>('');
    const [progresses, setProgresses] = useState<number[]>(new Array(stories.length).fill(0));
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);
    const [animateLike, setAnimateLike] = useState(false);

    const resetProgress = () => {
        setProgresses(new Array(stories.length).fill(0));
        if (progressInterval) {
            clearInterval(progressInterval);
        };
    };

    useEffect(() => {
        if (stories.length) {
            const s = stories[0];
            if (s?.storyType === StoryTypes.VIDEO) {
                const videoElement = document.createElement('video');
                videoElement.src = s?.contentAddress;
                videoRefs.current = [videoElement];
            };
        }
    }, [stories]);

    useEffect(() => {
        if (!isOpen || !stories.length) return;

        resetProgress();

        if (stories[currentMediaIndex]?.storyType === StoryTypes.VIDEO
            || stories[currentMediaIndex]?.storyType === StoryTypes.POST) {
            const video = videoRefs.current[currentMediaIndex];
            if (!video) return;

            const updateProgress = () => {
                if (video.duration > 0 && !isPaused) {
                    const progressPercentage = (video.currentTime / video.duration) * 100;
                    setProgresses((prev) => {
                        const updatedProgress = [...prev];
                        updatedProgress[currentMediaIndex] = Math.min(progressPercentage, 100);
                        return updatedProgress;
                    });
                }
            };

            if (isPaused) {
                video.pause();
            } else {
                video.play();
                setProgressInterval(setInterval(updateProgress, 50));
            }

            video.addEventListener('ended', goToNextStory);

            return () => {
                video.removeEventListener('ended', goToNextStory);
                clearInterval(progressInterval!);
            };
        } else {
            let startTime = Date.now();
            let newTimer: NodeJS.Timeout | null = null;

            const updateProgress = () => {
                const elapsedTime = Date.now() - startTime;
                const progressPercentage = (elapsedTime / 5000) * 100;

                if (!isPaused) {
                    setProgresses((prev) => {
                        const updatedProgress = [...prev];
                        updatedProgress[currentMediaIndex] = Math.min(progressPercentage, 100);
                        return updatedProgress;
                    });
                }

                if (elapsedTime >= 5000 && !isPaused) {
                    clearTimeout(newTimer!);
                    goToNextStory();
                }
            };

            if (!isPaused) {
                newTimer = setInterval(updateProgress, 50);
            }

            setProgressInterval(() => {
                clearInterval(progressInterval!);
                return newTimer;
            });

            return () => {
                clearTimeout(newTimer!);
                clearInterval(progressInterval!);
            };
        };
    }, [currentMediaIndex, stories, isOpen, isPaused]);

    const { createStorySeen } = useCreateStorySeen();

    useEffect(() => {
        if (isOpen && !isMyStories && stories[currentMediaIndex]?.id) {
            (!stories[currentMediaIndex]?.seenByCurrentUser) &&
                createStorySeen({ storyId: stories[currentMediaIndex]?.id, ownerId: user?.id },
                    () => {
                        setStories((prev: any[]) => {
                            let updatedStories = [...prev];
                            updatedStories[currentMediaIndex].seenByCurrentUser = true;
                            return updatedStories;
                        });
                    });
        }
    }, [currentMediaIndex]);

    const goToPreviousStory = () => {
        if (currentMediaIndex > 0) {
            const liked: boolean = stories[currentMediaIndex - 1]?.likedByCurrentUser;
            setIsLiked(liked || false);
            isMuted && handleToggleMuteStory();
            setCurrentMediaIndex(currentMediaIndex - 1);
            isPaused && setIsPaused(false);
        } else {
            handleViewPrevOrNextUserStory
                ? handleViewPrevOrNextUserStory(handleClose, "prev")
                : handleClose();
        }
    };

    const goToNextStory = () => {
        if (currentMediaIndex < stories.length - 1) {
            const liked: boolean = stories[currentMediaIndex + 1]?.likedByCurrentUser;
            setIsLiked(liked || false);
            isMuted && handleToggleMuteStory();
            setCurrentMediaIndex(currentMediaIndex + 1);
            isPaused && setIsPaused(false);
        } else {
            handleViewPrevOrNextUserStory
                ? handleViewPrevOrNextUserStory(handleClose, "next")
                : handleClose();
        }
    };

    const handleClose = () => {
        setCurrentMediaIndex(0);
        resetProgress();
        setIsLiked(false);
        setCommentText('');
        setIsPaused(false);
        if (progressInterval) clearInterval(progressInterval);
        onClose();
        refetchStories?.();
    };

    const handlePauseStory = () => {
        setIsPaused(true);
        if (progressInterval) {
            clearInterval(progressInterval);
        }
    };

    const handlePlayStory = () => {
        setIsPaused(false);
    };

    const handleToggleMuteStory = () => {
        setIsMuted(prev => {
            if (videoRefs.current[currentMediaIndex]) {
                videoRefs.current[currentMediaIndex].muted = !prev;
            };

            return !prev;
        });
    };

    const handleShowMoreOptions = () => {
        handlePauseStory();
        setShowMoreOptions(stories[currentMediaIndex]);
    };

    const handleCloseMoreOptions = () => {
        handlePlayStory();
        setShowMoreOptions(null);
    };

    const { likeUnlikeStory, loading: likingUnlikingStory } = useLikeUnlikeStory();

    const handleLikeUnlikeStory = () => {
        if (!likingUnlikingStory && stories[currentMediaIndex]?.id) {
            const liked = !stories[currentMediaIndex]?.likedByCurrentUser || false;
            setIsLiked(liked);
            setAnimateLike(true);

            setStories((prev: any[]) => {
                let updatedStories = [...prev];
                updatedStories[currentMediaIndex].likedByCurrentUser = liked;
                return updatedStories;
            });

            likeUnlikeStory(
                stories[currentMediaIndex]?.id,
                liked
            );
        }
    };

    const { removeStory, loading: removingStory } = useRemoveStory();

    const handleRemoveStory = () => {
        if (!removingStory && stories[currentMediaIndex]?.id) {
            removeStory(
                stories[currentMediaIndex]?.id,
                () => {
                    setStories((prev: any[]) => {
                        let updatedStories = [...prev];
                        updatedStories.splice(currentMediaIndex, 1);
                        return updatedStories;
                    });
                    handleCloseMoreOptions();
                    handleClose();
                }
            );
        };
    };

    const { createComment, loading: creatingComment } = useCreateComment();

    const handleAddComment = () => {
        commentText && !creatingComment && createComment({
            storyId: stories[currentMediaIndex]?.id as number,
            text: commentText
        }, handleClose);
    };

    const { data: storyViewers, isFetching: fetchingViewers, refetch: fetchViewers } = useGetStoryViewers(stories[currentMediaIndex]?.id);

    const { data: storyComments, isFetching: fetchingComments, refetch: fetchComments } = useGetStoryComments(stories[currentMediaIndex]?.id);

    useEffect(() => {
        if (!!showViewersOrCommentsDialog && isMyStories && stories[currentMediaIndex]?.id) {
            showViewersOrCommentsDialog === "viewers"
                ? fetchViewers()
                : showViewersOrCommentsDialog === "comments"
                    ? fetchComments()
                    : null;
        }
    }, [showViewersOrCommentsDialog]);

    const handleShowOrHideShare = (state: boolean) => {
        state
            ? handlePauseStory()
            : handlePlayStory();
        setIsShareOpen(state);
    };

    useEffect(() => {
        if (animateLike) {
            const timer = setTimeout(() => setAnimateLike(false), 300);
            return () => clearTimeout(timer);
        };
    }, [animateLike]);

    return (
        <Dialog fullScreen open={isOpen} onClose={handleClose}>
            <div className="relative overflow-hidden w-full h-full flex bg-black">
                <div className="absolute top-0 left-0 flex justify-center gap-2 pb-2 z-50 w-full ">
                    {stories.map((_, index) => (
                        <div key={index} className="w-1/5 h-1 flex-grow bg-gray-600 relative">
                            <div
                                className="h-full bg-green-500"
                                style={{ width: `${progresses[index]}%`, transition: 'width 0.05s ease-out' }}
                            ></div>
                        </div>
                    ))}
                </div>

                <div className='flex items-center bg-gradient-to-t from-transparent to-black/50 justify-between w-full absolute top-0 left-0 z-50'>
                    <div className='flex items-center gap-2 py-2'>
                        <IconButton className='text-white' onClick={handleClose}>
                            <IconArrowLeft />
                        </IconButton>
                        <div className='flex items-center gap-2'>
                            <Avatar aria-label="recipe" className={`border ${!user?.imageAddress && "bg-gray-200 text-black text-sm"}`}>
                                {user?.imageAddress
                                    ? <LazyLoadImage src={user?.imageAddress} />
                                    : <p className='uppercase'>{user?.username?.slice(0, 1)}</p>}
                            </Avatar>
                            <div className='text-white'>
                                <p className='mt-2' style={{ lineHeight: "0.6" }}>{user?.username}</p>
                                <small>{DaysAgo(stories[currentMediaIndex]?.createdDate)}</small>
                            </div>
                        </div>
                    </div>
                    <div className='text-white z-50'>
                        <IconButton color="inherit" onClick={isPaused
                            ? handlePlayStory
                            : handlePauseStory}>
                            {isPaused
                                ? <PlayerPlayIcon />
                                : <PlayerPauseIcon />}
                        </IconButton>
                        <IconButton color="inherit" onClick={handleToggleMuteStory}>
                            {stories[currentMediaIndex]?.storyType === StoryTypes.VIDEO &&
                                (!isMuted
                                    ? <VolumeIcon />
                                    : <VolumeOffIcon />)}
                        </IconButton>
                        {isMyStories &&
                            <IconButton color="inherit" onClick={handleShowMoreOptions}>
                                <DotsVertical />
                            </IconButton>}
                    </div>
                </div>

                <div
                    className="absolute top-2 left-0 w-full h-full flex justify-between"
                    onClick={goToNextStory}
                >
                    <div
                        key={currentMediaIndex}
                        className="flex-shrink-0 w-full h-full snap-center flex justify-center items-center animate-slide-in"
                    >
                        <RenderStory
                            story={stories[currentMediaIndex]}
                            currentMediaIndex={currentMediaIndex}
                            videoRefs={videoRefs}
                            isPaused={isPaused}
                        />
                    </div>

                    {stories[currentMediaIndex]?.text && (
                        <div
                            style={{
                                position: "absolute",
                                color: stories[currentMediaIndex]?.textStyle === "black-text-on-white" ? "black" : "white",
                                backgroundColor: stories[currentMediaIndex]?.textStyle === "black-text-on-white" ? "white" : "black",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                fontSize: "16px",
                                width: "fit-content",
                                opacity: 0.85,
                                overflowWrap: "break-word",
                                left: `${stories[currentMediaIndex]?.textPositionX}px`,
                                top: `${stories[currentMediaIndex]?.textPositionY}px`,
                            }}
                        >
                            <p
                                className="relative"
                                style={{
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                    color: "inherit",
                                    fontSize: "16px",
                                    resize: "none",
                                    minWidth: "100px",
                                    whiteSpace: "normal",
                                    maxWidth: "80vw",
                                    overflowWrap: "break-word",
                                    direction: "ltr",
                                    height: "auto",
                                    width: "auto",
                                    textAlign: "center"
                                }}
                            >
                                {stories[currentMediaIndex]?.text}
                            </p>
                        </div>
                    )}
                </div>

                <div className='bottom-0 left-0 w-full absolute z-50'>
                    {isMyStories
                        ? <div className='text-white left-2 bottom-2 absolute flex gap-3 items-center'>
                            <div className='flex gap-1 items-center mr-5' onClick={() => {
                                handlePauseStory();
                                setShowViewersOrCommentsDialog("viewers");
                            }}>
                                <EyeIcon size={20} />
                                <Typography variant='subtitle2' className='italic'>{stories[currentMediaIndex]?.storySeensCount || 0} Views</Typography>
                            </div>
                            <div className='flex gap-1 items-center' onClick={() => {
                                handlePauseStory();
                                setShowViewersOrCommentsDialog("comments");
                            }}>
                                <Comment size={20} color="white" />
                                <Typography variant='subtitle2' className='italic text-[14px]'>{stories[currentMediaIndex]?.commentCount || 0} Comments</Typography>
                            </div>
                        </div>
                        : <div className='flex justify-between items-center mx-2 pt-3 pb-1 w-full bg-gradient-to-b from-transparent to-black/50'>
                            <div className='relative w-full text-white'>
                                <input
                                    className='bg-transparent text-white border border-slate-200 w-full rounded-full px-3 py-2'
                                    type='text'
                                    placeholder='Write a comment...'
                                    value={commentText}
                                    onFocus={handlePauseStory}
                                    onBlur={handlePlayStory}
                                    onChange={e => setCommentText(e.target.value)}
                                />
                                {creatingComment
                                    ? <CircularProgress className='absolute right-2 top-1' />
                                    : <span className='w-8 h-8 rounded-full bg-[#669168] absolute right-1 top-[50%] -translate-y-[50%] flex items-center justify-center'><IconSend2 size={20} onClick={handleAddComment} /></span>}
                            </div>

                            <IconButton onClick={handleLikeUnlikeStory} className={`mr-12 ${animateLike ? "animate-like" : ""}`}>
                                {isLiked
                                    ? <HeartFilled color='green' size={30} />
                                    : <Heart strokeWidth={1.5} size={30} className='text-white' />}
                            </IconButton>
                        </div>}

                    <IconButton title='Share' onClick={() => handleShowOrHideShare(true)} className="absolute bottom-1 right-0 mr-1">
                        <Share strokeWidth={1.5} color='white' size={25} />
                    </IconButton>
                </div>

                <div
                    className="absolute top-0 left-0 w-full h-full flex justify-between items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <IconButton onClick={goToPreviousStory} color="primary" className="w-1/4 h-screen text-white opacity-0">
                        <ArrowLeft />
                    </IconButton>

                    <IconButton onClick={goToNextStory} color="primary" className="w-1/2 h-screen text-white opacity-0">
                        <ArrowNarrowRightIcon />
                    </IconButton>
                </div>
            </div>

            {!!showMoreOptions &&
                <BottomSheet isOpen={!!showMoreOptions} onClose={handleCloseMoreOptions}>
                    <div
                        className='flex items-center gap-3 p-3 text-warning'
                        onClick={() => navigate('/specter/story/editor', { state: { props: { story: stories[currentMediaIndex] } } })}>
                        <PencilCheckIcon />
                        <Typography variant='body1'>
                            Edit
                        </Typography>
                    </div>
                    <div className='flex items-center gap-3 p-3 text-red-900' onClick={handleRemoveStory}>
                        <Trash />
                        {removingStory
                            ? <div className='text-center'><CircularProgress /></div>
                            : <Typography variant='body1'>
                                Remove
                            </Typography>}
                    </div>
                </BottomSheet>}

            {!!showViewersOrCommentsDialog &&
                <BottomSheet isOpen={!!showViewersOrCommentsDialog} onClose={() => {
                    handlePlayStory();
                    setShowViewersOrCommentsDialog("");
                }}>
                    <div className="p-3">
                        <Typography variant='body1' className='italic text-center'>
                            {showViewersOrCommentsDialog.toUpperCase()}
                        </Typography>

                        {showViewersOrCommentsDialog === "comments"
                            ? fetchingComments
                                ? <div className='text-center'><CircularProgress /></div>
                                : storyComments?.pages?.flatMap(page => (
                                    page?.storyComment_getStoryComments?.result?.items?.length
                                        ? page?.storyComment_getStoryComments?.result?.items?.map(c => (
                                            <div className='flex flex-col' key={c.id}>
                                                <div className='flex gap-2 items-center mb-3'>
                                                    <Avatar src={c.user.imageAddress} />
                                                    <Link to={`/specter/userProfile/${c.user.id}`}>
                                                        <Typography variant='subtitle2' style={{ fontWeight: "bold" }}>{c.user.username}</Typography>
                                                        <p className='italic text-[14px] font-medium text-gray-600'>{c.text}</p>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                        : <Typography variant='subtitle2' className='italic text-center p-5'>No Comment(s) yet!</Typography>
                                ))
                            : fetchingViewers
                                ? <div className='text-center'><CircularProgress /></div>
                                : storyViewers?.pages?.flatMap(page => (
                                    page?.storySeen_getStorySeens?.result?.items?.length
                                        ? page?.storySeen_getStorySeens?.result?.items?.map(s => (
                                            <div className='flex flex-col' key={s.id}>
                                                <div className='flex justify-between items-center mb-3'>
                                                    <div className='flex gap-2 items-center'>
                                                        <Avatar src={s.user.imageAddress} />
                                                        <Link to={`/specter/userProfile/${s.user.id}`}>
                                                            <Typography variant='subtitle2' style={{ fontWeight: "bold" }}>{s.user.username}</Typography>
                                                        </Link>
                                                    </div>
                                                    {s.isLiked && <HeartFilled color='green' size={30} />}
                                                </div>
                                            </div>
                                        ))
                                        : <Typography variant='subtitle2' className='italic text-center p-5'>No View(s) yet!</Typography>
                                ))}
                    </div>
                </BottomSheet>}

            {isShareOpen &&
                <ShareUIDrawer
                    showShare={isShareOpen}
                    setShowShare={state => handleShowOrHideShare(state)}
                    entityId={stories[currentMediaIndex]?.id}
                    entityType={MessageTypes.STORY}
                />}
        </Dialog>
    );
});

export default StoryViewer;

interface RenderStoryProps {
    story: MyStory | UserStory;
    videoRefs?: React.MutableRefObject<(HTMLVideoElement | null)[]>;
    currentMediaIndex?: number;
    isPaused?: boolean;
    isNew?: boolean;
};

export const RenderStory = memo(({ story, videoRefs, currentMediaIndex, isPaused, isNew }: RenderStoryProps) => {
    return (<>
        {story?.storyType === StoryTypes.VIDEO
            ? <video
                ref={(el) => { if (el && videoRefs && currentMediaIndex) videoRefs.current[currentMediaIndex] = el; }}
                src={isNew
                    ? URL.createObjectURL(story?.contentAddress as any)
                    : story?.contentAddress}
                className="max-w-full max-h-full"
                playsInline
                autoPlay={!isPaused}
            />
            : story?.storyType === StoryTypes.IMAGE
                ? <LazyLoadImage
                    src={isNew
                        ? URL.createObjectURL(story?.contentAddress as any)
                        : story?.contentAddress}
                    alt="Story"
                    className="max-w-full max-h-full"
                />
                : story?.storyType === StoryTypes.POST
                    ? <RenderPostStory
                        story={story}
                        videoRefs={videoRefs}
                        currentMediaIndex={currentMediaIndex}
                        isPaused={isPaused}
                    />
                    : null}
    </>);
});

interface RenderPostStoryProps {
    story: MyStory | UserStory;
    videoRefs?: React.MutableRefObject<(HTMLVideoElement | null)[]>;
    currentMediaIndex?: number;
    isPaused?: boolean;
};

const RenderPostStory = memo(({ story, videoRefs, currentMediaIndex, isPaused }: RenderPostStoryProps) => {

    const postData = parsePostItems(story?.post?.postItemsString);
    const data = postData ? postData[postData.length - 1] : [];

    return <div className='h-4/5 relative rounded-lg'>
        <div className="flex items-center gap-2 absolute top-2 left-2 cursor-pointer">
            <Avatar
                aria-label="recipe"
                className={`h-5 w-5 border ${!story?.post?.poster?.imageAddress && "bg-gray-200 text-sm text-black"}`}
            >
                {story?.post?.poster?.imageAddress
                    ? <LazyLoadImage src={story?.post?.poster?.imageAddress} />
                    : <p>{story?.post?.poster?.username?.slice(0, 1)}</p>}
            </Avatar>
            <p className="text-sm font-bold text-gray-500">
                {story?.post?.poster?.username || ""}
            </p>
        </div>

        {isVideo(data?.Content)
            ? <video
                ref={(el) => { if (el && videoRefs && currentMediaIndex) videoRefs.current[currentMediaIndex] = el; }}
                src={data?.Content}
                className="max-w-full max-h-full rounded-lg"
                playsInline
                autoPlay={!isPaused}
                loop={isPaused === undefined ? true : !Boolean(isPaused)}
            />
            : isImage(data?.Content)
                ? <LazyLoadImage
                    src={data?.Content}
                    className='rounded-lg h-full object-cover'
                    alt='Post Media'
                />
                : null}
    </div>
});
