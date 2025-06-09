import { lazy, useEffect, useState, useRef } from 'react';
import { Typography, IconButton, Card } from "@mui/material";
import { IconArrowLeft, IconDots, IconMessage2, IconShare } from "@tabler/icons-react";
import SkinVideoJs from '@/components/SkinVideoJs';
import { Slice } from '@/helper';
import { parsePostItems } from '@/components/Grid/utils';
import { DaysAgo } from '@/app/utility/misc.helpers';
import useGetPostsInAdvancedWay from '../../../queries/getPostsInAdvanceWay';
import { GetPostType } from '@/constants/storage/constant';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import UserAvatar from '@/components/Stories/components/UserAvatar';
import { useSnapshot } from 'valtio';
import { userStore } from '@/store/user';
import VideoLike from './VideoLike';
import { MessageTypes } from '@/app/scene/Inbox/mutations/addMessage';
import useAddViewToPosts from '../../../mutations/addViewToPost';
import VideoPageSkeleton from './VideDetailSkeleton';
import UpNextVideos from './UpNextVideos';

const ShareUIDrawer = lazy(() => import("@/components/Feed/ShareUIDrawer"));
const CommentsDrawer = lazy(() => import("@/components/Feed/Comments"));
const MoreOptionDrawer = lazy(() => import("@/components/Feed/MoreOptionDrawer"));

const VideoDetail: React.FC = () => {
    const navigate = useNavigate();
    const { vId } = useParams();
    const { state } = useLocation();

    const nextVideos = useRef(state?.props?.nextVideos?.length ? state?.props?.nextVideos : []);
    const user = useSnapshot(userStore.store).user;

    const {
        data,
        getData,
        setData,
        isLoading,
    } = useGetPostsInAdvancedWay({
        getPostType: GetPostType.Recommended,
        where: {
            post: {
                id: { eq: +vId! }
            },
        },
    });

    useEffect(() => {
        vId && getData();
    }, [vId]);

    const [postItems, setPostItems] = useState<any[]>([]);
    const [showShare, setShowShare] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState<null | number>(null);

    const { addViewToPosts } = useAddViewToPosts();

    useEffect(() => {
        if (data.length && !isLoading) {
            setPostItems(parsePostItems(data[0]?.postItemsString || '[]'));
            setTimeout(() => {
                window.scrollTo(-10000, -10000);
            }, 10);
        };

        if (!isLoading && data.length && data[0]?.post?.id && !data[0]?.isYourPost && !data[0]?.isViewed) {
            addViewToPosts({ postIds: [data[0]?.post?.id] }, () => {
                setData(prev => {
                    return prev.map(p => ({ ...p, viewCount: p?.viewCount + 1, isViewed: true }))
                });
            });
        };
    }, [data, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            setTimeout(() => {
                window.scrollTo(-10000, -10000);
            }, 10);
        };
    }, [isLoading]);

    const handleUserProfile = () => {
        user?.id === data[0]?.post?.poster?.id
            ? navigate(`/specter/profile`)
            : navigate(`/specter/userProfile/${data[0]?.post?.poster?.id}`);
    };

    const navigateBack = () => navigate('/specter/youtube');

    return (<>
        <div className="flex flex-col justify-start bg-[#0f0f0f] h-screen overflow-y-auto text-white">
            <header className="flex items-center justify-between bg-transparent absolute top-0 z-50 bg-gray-950 shadow-sm">
                <IconButton onClick={navigateBack}>
                    <IconArrowLeft size={24} color="white" />
                </IconButton>
                <div />
            </header>

            {isLoading
                ? <VideoPageSkeleton />
                : <main className="flex flex-col md:flex-row gap-4">
                    <div className='flex-1'>
                        <Card className="w-full">
                            <SkinVideoJs
                                src={postItems[0]?.Content || ''}
                                poster={postItems[0]?.ThumNail || ''}
                                className="w-full h-[250px] md:h-[633px] rounded-lg"
                                layout="horizontal-layout"
                                controls
                                playsInline
                                responsive
                                autoplay
                                preload='metadata'
                            />
                        </Card>

                        <div className='px-4 pb-2'>
                            <Typography className="mt-4 text-md font-semibold">{data[0]?.post?.yourMind}</Typography>
                            <Typography className="text-gray-400 text-xs">{data[0]?.viewCount || 0} views • {DaysAgo(data[0]?.post?.createdDate)}</Typography>
                        </div>

                        <div className="bg-[#0f0f0f] p-2 rounded-lg w-full pb-4">
                            <div className="flex items-center gap-3 p-2">
                                <UserAvatar
                                    user={data[0]?.post?.poster as any}
                                    isSelf={user?.id === data[0]?.post?.poster?.id}
                                    size="10"
                                />
                                <div onClick={handleUserProfile}>
                                    <Typography className="font-semibold text-sm">{data[0]?.post?.poster?.displayName}</Typography>
                                    <Typography className="text-gray-400 text-xs">{data[0]?.posterFollowerCount || 0} followers</Typography>
                                </div>
                            </div>
                            <div className="flex items-center justify-start gap-2 !text-xs">
                                <div className="flex bg-[#272727] text-white rounded-full overflow-hidden">
                                    <VideoLike
                                        id={data[0]?.post?.id}
                                        liked={data[0]?.isLiked}
                                        count={data[0]?.likeCount}
                                    />
                                </div>
                                <IconButton
                                    className="bg-[#272727] !text-white px-4 p-2 !rounded-full hover:bg-gray-700 flex items-center !text-xs !border-none"
                                    onClick={() => setShowComments(true)}
                                >
                                    <IconMessage2 size={15} className="mr-2" /> Comment
                                </IconButton>
                                <IconButton
                                    className="bg-[#272727] !text-white px-4 p-2 !rounded-full hover:bg-gray-700 flex items-center !text-xs !border-none"
                                    onClick={() => setShowShare(true)}
                                >
                                    <IconShare size={15} className="mr-2" /> Share
                                </IconButton>
                                <IconButton
                                    className="bg-[#272727] text-white !rounded-full hover:bg-gray-700"
                                    onClick={() => setShowMoreOptions(data[0]?.post?.id)}
                                >
                                    <IconDots size={20} />
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    <UpNextVideos
                        videos={nextVideos.current || []}
                        currentId={data[0]?.post?.id}
                    />
                </main>}
        </div>

        {showShare &&
            <ShareUIDrawer
                showShare={showShare}
                setShowShare={setShowShare}
                entityId={data[0]?.post?.id}
                entityType={MessageTypes.POST}
            />}

        {showComments &&
            <CommentsDrawer
                showComments={showComments}
                setShowComments={setShowComments}
                postId={data[0].post?.id}
                postOwnerId={data[0]?.post?.poster?.id}
            />}

        {!!showMoreOptions &&
            <MoreOptionDrawer
                isOpen={showMoreOptions}
                setIsOpen={setShowMoreOptions}
                post={data[0]}
                onDelete={navigateBack}
            />}
    </>);
};

export default VideoDetail;
