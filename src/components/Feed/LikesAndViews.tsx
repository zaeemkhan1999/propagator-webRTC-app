import { useEffect } from 'react';
import BottomSheet from '../BottomSheet/BottomSheet';
import HeartFilled from "@/assets/icons/HeartFilled";
import PlayerPlayIcon from '@/assets/icons/Play';
import useGetPostLikes from '@/app/scene/Home/queries/getPostLikes';
import { CircularProgress } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import UserAvatar from '../Stories/components/UserAvatar';

interface Props {
    show: null | { id: number, viewCount: number };
    setShow: Function;
    userId: number;
};

const LikesAndViews = ({ show, setShow, userId }: Props) => {

    const {
        data,
        getData,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetching } = useGetPostLikes();

    useEffect(() => {
        show && getData(show.id);
    }, [show]);

    const { ref: lastLikeRef } = useInView({
        triggerOnce: false,
        threshold: 0.03,
        onChange: inView => {
            if (inView && hasNextPage && !isLoading && !isFetching && data.length) {
                fetchNextPage();
            };
        }
    });

    return (!!show &&
        <BottomSheet
            position="fixed"
            maxW="sm"
            isOpen={!!show}
            onClose={() => setShow(null)}>
            <div className="w-1/3 mx-auto max-h-screen overflow-y-auto pb-8">
                <div className="text-xxl mb-3 flex items-center justify-center border-b border-gray-100 pb-4 text-center font-bold">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1">
                            <HeartFilled
                                size={20}
                                strokeWidth={1.4}
                                className={`text-green-500 fill-current`}
                            /> {data.length}
                        </div>

                        <div className="flex items-center gap-1">
                            <PlayerPlayIcon
                                size={20}
                                strokeWidth={1.4}
                                className={`text-green-500 fill-current`}
                            /> {show.viewCount || 0}
                        </div>
                    </div>
                </div>

                {(isLoading && !isFetching)
                    ? <CircularProgress className="text-center" />
                    : data?.length
                        ? data?.map(u => (
                            <div key={u?.user?.id} className='flex gap-3 py-3 items-center'>
                                <UserAvatar
                                    user={u?.user}
                                    isSelf={u?.user?.id === userId}
                                    size="7"
                                />
                                <p>{u?.user?.username}</p>
                            </div>
                        ))
                        : <p className="italic text-gray-500">No Like yet!</p>}

                <div ref={lastLikeRef}></div>
                {(isFetching && !isLoading) && <CircularProgress className="text-center" />}
            </div>
        </BottomSheet>
    );
};

export default LikesAndViews;
