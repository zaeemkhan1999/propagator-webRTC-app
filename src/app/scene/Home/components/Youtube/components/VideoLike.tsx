import { useLikePost } from '@/app/services/mutations/likePost.mutation';
import { useUnLikePost } from '@/app/services/mutations/unLikePost.mutation';
import { IconButton } from '@mui/material';
import { IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react';
import { memo, useEffect, useState } from 'react';

interface Props {
    liked: boolean;
    count: number;
    id: number;
};

const VideoLike = memo(({ liked, count, id }: Props) => {

    const [likeData, setLikeData] = useState({ isLiked: liked || false, likeCount: count || 0 });
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setLikeData({ isLiked: liked, likeCount: count });
    }, [liked, count]);

    const { mutate: likePost } = useLikePost();
    const { mutate: unLikePost } = useUnLikePost();

    const handleLikeUnlike = () => {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        };

        setLikeData(prev => {
            setAnimate(true);
            if (prev.isLiked) {
                unLikePost({ postId: id });
                return { isLiked: false, likeCount: prev.likeCount - 1 };
            } else {
                likePost({ liked: true, postId: id })
                return { isLiked: true, likeCount: prev.likeCount + 1 };
            };
        });
    };

    useEffect(() => {
        if (animate) {
            const timer = setTimeout(() => setAnimate(false), 300);
            return () => clearTimeout(timer);
        };
    }, [animate]);

    return (
        <IconButton
            onClick={handleLikeUnlike}
            className={`text-white px-3 ${animate ? " animate-like" : ""}`}>
            {likeData.isLiked
                ? <IconThumbUpFilled className="text-green-500" size={18} />
                : <IconThumbUp size={18} />}
            <span className="ml-1 text-xs">{likeData.likeCount}</span>
        </IconButton>
    );
});

export default VideoLike;
