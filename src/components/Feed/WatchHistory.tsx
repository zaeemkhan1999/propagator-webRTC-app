import { lazy, useEffect, useState } from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import useGetWatchedHistory from '@/app/scene/Home/queries/getWatchedHistory';
import Feed from '.';
import FeedSkeleton from '../Skeleton/FeedSkeleton';
import { NoData } from '@/app/scene/Home/components/You';
import { useSnapshot } from 'valtio';
import { userStore } from '@/store/user';
import { parsePostItemsHome } from '@/helper';

const LikesAndViews = lazy(() => import("@/components/Feed/LikesAndViews"));

const WatchHistory = () => {
    const navigate = useNavigate();
    const user = useSnapshot(userStore.store).user;

    const [posts, setPosts] = useState<any[]>([]);
    const [showLikes, setShowLikes] = useState<null | { id: number, viewCount: number }>(null);

    const { data, setData, getWatchedHistory, loading } = useGetWatchedHistory();

    useEffect(() => {
        getWatchedHistory();
    }, []);

    useEffect(() => {
        setPosts(() => {
            return data?.map(item => ({
                ...item,
                postItemsString: parsePostItemsHome(item?.post?.postItemsString ?? null)
            })) || []
        });
    }, [data]);

    const handleOnDelete = (id: number) => {
        setData(prev => prev.filter(post => post?.post?.id !== id));
    };

    return (
        <div>
            <Header
                text='Watch History'
                handleBack={() => navigate('/specter/home')}
                bgColor='black'
            />

            <div
                className="w-full h-dvh md:h-screen overflow-y-auto snap-y snap-mandatory snap-fast bg-black"
                style={{
                    scrollBehavior: "smooth",
                    transition: "transform 0.06s ease-in",
                }}
            >
                {loading
                    ? <FeedSkeleton />
                    : posts.length
                        ? posts.map((post) => (
                            <Feed
                                key={post?.post?.id}
                                post={post}
                                onDelete={handleOnDelete}
                                userId={user?.id}
                                setShowLikes={setShowLikes}
                            />
                        ))
                        : <NoData />}
            </div>

            {!!showLikes &&
                <LikesAndViews
                    show={showLikes}
                    setShow={setShowLikes}
                    userId={user?.id!}
                />}
        </div>
    );
};

export default WatchHistory;
