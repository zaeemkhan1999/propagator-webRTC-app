import { Typography } from '@mui/material';
import { useEffect } from 'react';
import ShortsCard from './ShortsCard';
import useGetPostsInAdvancedWay from '../../../queries/getPostsInAdvanceWay';
import { GetPostType } from '@/constants/storage/constant';
import { useNavigate } from 'react-router-dom';
import ShortsSkeleton from './ShortsSkeleton';

const Shorts = () => {
    const navigate = useNavigate();

    const { data,
        getData,
        isLoading
    } = useGetPostsInAdvancedWay({
        getPostType: GetPostType.Recommended,
        where: {
            post: {
                isCreatedInGroup: { eq: false },
                aspectRatio: { eq: "ORIGINAL" },
            },
        },
    });

    useEffect(() => {
        getData();
    }, []);

    const handleVideoClick = (id: number) => {
        navigate(`/specter/home?post=${id}&page=${1}`, { viewTransition: true });
    };

    return (
        <div className="w-full pb-4 bg-gray-850" >
            <Typography variant="h6" className="text-white mb-2">Rolls</Typography>
            <div className="flex overflow-x-auto gap-4">
                {isLoading
                    ? <ShortsSkeleton />
                    : data.length &&
                    data.map((video) => (
                        <ShortsCard
                            key={`shorts-${video?.post?.id}`}
                            video={video}
                            handleVideoClick={handleVideoClick}
                        />
                    ))}
            </div>
        </div>
    );
};

export default Shorts;
