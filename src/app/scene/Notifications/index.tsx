import { useState, useEffect, useRef } from 'react';
import { Notification, NotificationItem, useGetNotifications } from './queries/getNotifications';
import { CircularProgress, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import NoData from "@/app/utility/Nodata.json";
import { DaysAgo } from '@/app/utility/misc.helpers';
import { notificationENUMS } from '@/constants';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { parsePostItems } from '@/components/Grid/utils';
import Logo from "@/assets/images/logo.png";
import { Link } from 'react-router-dom';
import { StoryTypes } from '@/components/Stories/mutation/createMyStory';
import { handleOnErrorImage } from '@/helper';
import ArrowLeft from '@/assets/icons/ArrowLeft';
import ArrowNarrowRightIcon from '@/assets/icons/ArrowRight';
import HeartFilled from '@/assets/icons/HeartFilled';
import UserPlus from '@/assets/icons/UserPlus';
import UserMinus from '@/assets/icons/UserMinus';
import UsersGroupIcon from '@/assets/icons/UserGroup';
import { useSnapshot } from 'valtio';
import { userStore } from '@/store/user';
import UserAvatar from '@/components/Stories/components/UserAvatar';
import { IconMessage2, IconRefresh } from '@tabler/icons-react';

const Notifications = () => {
    const user = useSnapshot(userStore.store).user;
    const navigate = useNavigate();
    const lastNotificationRef = useRef<null | HTMLDivElement>(null);

    const [notifications, setNotifications] = useState<Notification[] | []>([]);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isLoading,
        refetch,
    } = useGetNotifications();

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (data?.pages) {
            const n =
                data.pages.flatMap(
                    (n) => n?.notification_getMyNotifications?.result?.items,
                ) || [];
            setNotifications(n);
        }
    }, [data?.pages]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetching) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        if (lastNotificationRef.current) {
            observer.observe(lastNotificationRef.current);
        }

        return () => {
            if (lastNotificationRef.current) {
                observer.unobserve(lastNotificationRef.current);
            }
        };
    }, [hasNextPage, isFetching, fetchNextPage]);

    const getNoti = (n: NotificationItem) => {
        let element = null;
        let icon = null;
        let image = null;
        let comment = null;

        if (n.notificationType.includes('LIKE')) {
            icon = <HeartFilled className='text-green-500' size={20} />;
        } else if (n.notificationType.includes('COMMENT')) {
            icon = <IconMessage2 className='text-gray-400' size={20} />;
        } else if (n.notificationType === notificationENUMS.FOLLOW) {
            icon = <UserPlus className='text-green-400' size={20} />;
            image = <Link to={`/specter/userProfile/${n.sender.id}`} className='text-[12px] italic cursor-pointer'>View Profile</Link>
        } else if (n.notificationType === notificationENUMS.UN_FOLLOW) {
            icon = <UserMinus className='text-red-900' size={20} />;
            image = <Link to={`/specter/userProfile/${n.sender.id}`} className='text-[12px] italic cursor-pointer'>View Profile</Link>
        } else if (n.notificationType === notificationENUMS.NEW_USER_ADDED_TO_PRIVATE_GROUP) {
            icon = <UsersGroupIcon size={20} />;
            image = <Link to={`/specter/groups?tab=private`} className='text-[12px] italic cursor-pointer'>View Group</Link>
        }

        if (n.notificationType === notificationENUMS.ARTICLE_LIKE) {
            const parseData = parsePostItems(n?.articleLike?.article?.articleItemsString);

            image = (parseData[0]?.ArticleItemType === 0 || parseData[0]?.ArticleItemType === 1 || parseData[0]?.ArticleItemType === 2)
                && <LazyLoadImage
                    src={(parseData[0]?.ArticleItemType === 1 || parseData[0]?.ArticleItemType === 2)
                        ? parseData[0]?.Data
                        : Logo}
                    alt={n.text}
                    onError={handleOnErrorImage}
                    onClick={() => {
                        n.articleLike?.article?.id && navigate(`/specter/view/scroll/${n.articleLike?.article?.id}`);
                    }}
                    className="w-10 h-10 object-cover rounded-md"
                />
        } else if (n.notificationType === notificationENUMS.POST_LIKE
            || n.notificationType === notificationENUMS.NEW_COMMENT
            || n.notificationType === notificationENUMS.NEW_REPLY_COMMENT
            || n.notificationType === notificationENUMS.MENTION_IN_POST_COMMENT) {
            const parseData = parsePostItems(
                n.notificationType === notificationENUMS.POST_LIKE
                    ? n?.postLike?.post?.postItemsString
                    : n?.comment?.post?.postItemsString);

            image = (parseData[0]?.PostItemType === 0 || parseData[0]?.PostItemType === 1 || parseData[0]?.PostItemType === 2)
                && <LazyLoadImage
                    src={(parseData[0]?.PostItemType === 1
                        || parseData[0]?.PostItemType === 2
                        || (parseData[0]?.PostItemType === 0 && parseData[0]?.ThumNail))
                        ? parseData[0]?.ThumNail
                        : Logo}
                    onError={handleOnErrorImage}
                    alt={n.text}
                    onClick={() => {
                        if (n.notificationType === notificationENUMS.POST_LIKE && n?.postLike?.post?.id) {
                            navigate(`/specter/view/post/${n?.postLike?.post?.id}`)
                        } else if (n?.comment?.post?.id &&
                            (n.notificationType === notificationENUMS.NEW_COMMENT
                                || n.notificationType === notificationENUMS.NEW_REPLY_COMMENT
                                || n.notificationType === notificationENUMS.MENTION_IN_POST_COMMENT)) {
                            navigate(`/specter/view/post/${n?.comment?.post?.id}${n.notificationType === notificationENUMS.MENTION_IN_POST_COMMENT ? "?action=comments" : ""}`);
                        }
                    }}
                    className="w-10 h-10 object-cover rounded-md"
                />

            comment = n.notificationType === notificationENUMS.NEW_COMMENT
                ? n?.comment?.text
                : n.notificationType === notificationENUMS.NEW_REPLY_COMMENT
                    ? n?.comment?.parent?.text
                    : null;
        } else if (n.notificationType === notificationENUMS.LIKE_ARTICLE_COMMENT) {
            const parseData = parsePostItems(n?.postLike?.post?.postItemsString);
            image = (parseData[0]?.PostItemType === 0 || parseData[0]?.PostItemType === 1 || parseData[0]?.PostItemType === 2)
                && <LazyLoadImage
                    src={(parseData[0]?.PostItemType === 1 || parseData[0]?.PostItemType === 2)
                        ? parseData[0]?.ThumNail
                        : Logo}
                    alt={n.text}
                    onError={handleOnErrorImage}
                    className="w-10 h-10 object-cover rounded-md"
                />
        } else if (n.notificationType === notificationENUMS.STORY_LIKE || n.notificationType === notificationENUMS.NEW_COMMENT_TO_STORY) {
            comment = n.notificationType === notificationENUMS.NEW_COMMENT_TO_STORY && n?.storyComment?.text;

            let type;
            let img;

            if (n.notificationType === notificationENUMS.STORY_LIKE) {
                type = n?.storyLike?.story?.storyType === StoryTypes.VIDEO ? "video" : "image";
                img = n?.storyLike?.story?.contentAddress;
            } else if (n.notificationType === notificationENUMS.NEW_COMMENT_TO_STORY) {
                type = n?.storyComment?.story?.storyType === StoryTypes.VIDEO ? "video" : "image";
                img = n?.storyComment?.story?.contentAddress;
            }

            image = type === 'image'
                ? <LazyLoadImage
                    src={img ?? Logo}
                    alt={n.text}
                    className="w-10 h-10 object-cover rounded-md"
                    onClick={() => navigate('/specter/inbox')}
                />
                : <Link to={'/specter/inbox'}><video
                    controls
                    muted
                    loop
                    preload="metadata"
                    className="w-10 h-10 object-cover rounded-md"
                    poster={img}
                >
                    <source src={img} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                </Link>
        }

        element = <>
            <div className='flex gap-3 items-center'>
                <UserAvatar
                    user={n?.sender}
                    isSelf={user?.id === n?.sender?.id}
                    size="7"
                />
                <Typography variant='body1' className='text-[12px] font-bold'>{n.text} <small className='italic !font-medium'>{comment}</small></Typography>
                {icon}
                <Typography variant='body2' className='italic text-[10px]'>
                    {DaysAgo(n.createdDate)}
                </Typography>
            </div>
            {image}
        </>

        return element;
    };

    return (
        <div className="bg h-screen overflow-y-auto px-3 pb-10 pt-3">
            <div className="sticky z-10 top-0 mb-3 flex items-center justify-between rounded-lg bg-white p-3">
                <div className="flex gap-3">
                    <ArrowLeft className="text-black" onClick={() => navigate(-1)} />
                    <Typography variant="subtitle1">Notifications</Typography>
                </div>
                <IconRefresh onClick={() => refetch()} />
            </div>

            <div className="mt-2 flex cursor-pointer items-center justify-between rounded-lg bg-white p-4 shadow-sm hover:bg-gray-50">
                <div className="flex items-center gap-3">
                    <UserPlus className="text-gray-500" size={24} />
                    <div>
                        <Typography
                            className="text-[14px] font-medium text-black"
                            component="p"
                        >
                            Follow requests
                        </Typography>
                        <Typography className="text-[12px] text-gray-500" component="p">
                            Approve or ignore requests
                        </Typography>
                    </div>
                </div>
                <ArrowNarrowRightIcon className="text-gray-500" size={20} />
            </div>

            <div>
                {(isLoading && !isFetching)
                    ? <div className='text-center'><CircularProgress /></div>
                    : error
                        ? <Typography variant="body1" className="text-center italic mt-10">
                            Some error occured while getting Notifications!
                        </Typography>
                        : notifications.length
                            ? notifications.map(({ notification: n }) => (
                                <div key={n.id} className='flex justify-between my-3 items-center bg-gray-100 p-3 rounded-2xl'>
                                    {getNoti(n)}
                                </div>))
                            : <>
                                <Lottie loop animationData={NoData} style={{ width: "200px", height: "200px", margin: "0 auto" }} />
                                <Typography className='text-md text-center italic'>
                                    No new Notification(s) found. Please wait to arrive one!
                                </Typography>
                            </>}

                <div ref={lastNotificationRef}></div>

                {isFetching && !isLoading && (
                    <div className="text-center">
                        <div className="flex items-center justify-between p-2  rounded-xl w-full max-w-lg">
                            {/* Left Avatar */}
                            <Skeleton animation="wave" variant="circular" width={40} height={40} className="flex-shrink-0 bg-gray-200" />

                            {/* Text Content */}
                            <div className="flex-1 ml-2">
                                <Skeleton className='bg-gray-200' animation="wave" variant="text" width="70%" height={20} />
                                <Skeleton className='bg-gray-200' animation="wave" variant="text" width="40%" height={15} />
                            </div>

                            {/* Heart Icon */}
                            <Skeleton animation="wave" variant="circular" width={20} height={20} className="mr-2 bg-gray-200" />

                            {/* Right Avatar */}
                            <Skeleton animation="wave" variant="circular" width={40} height={40} className="flex-shrink-0 bg-gray-200" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
