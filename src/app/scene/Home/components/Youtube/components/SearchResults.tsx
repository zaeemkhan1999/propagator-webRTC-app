import { useEffect } from 'react';
import VideoSearch from './VideoSearch';
import { Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import useGetPostsInAdvancedWay from '../../../queries/getPostsInAdvanceWay';
import { GetPostType } from '@/constants/storage/constant';
import VideoCard from './VideoCard';
import VideoCardSkeleton from './VideoSkeleton';
import { IconArrowLeft } from '@tabler/icons-react';

const SearchResults = () => {
    const { q } = useParams();
    const navigate = useNavigate();

    const {
        data,
        getData,
        isLoading,
    } = useGetPostsInAdvancedWay({
        getPostType: GetPostType.Recommended,
        where: {
            post: {
                isCreatedInGroup: { eq: false },
                // aspectRatio: { eq: "16_9" },
                yourMind: { contains: q ?? '' },
            },
        },
    });

    useEffect(() => {
        getData();
    }, [q]);

    const handleVideoClick = (id: number) => {
        if (id) {
            navigate(`/specter/youtube/watch/${id}`, { state: { props: { nextVideos: data } }, viewTransition: true });
            setTimeout(() => {
                window.scrollTo(-10000, -10000);
            }, 10);
        };
    };

    return (
        <div className="min-w-[300px] bg-[#0f0f0f] text-white min-h-full overflow-y-auto">
            <div className='sticky top-0 z-50 flex items-center'>
                <IconArrowLeft className='pl-1' onClick={() => navigate(`/specter/youtube/`)} />
                <VideoSearch />
            </div>

            <div className="h-screen">
                <Typography variant="h6" className="mb-2 px-2">Search Results</Typography>
                {isLoading
                    ? <VideoCardSkeleton />
                    : data.length
                        ? data.map(v => (
                            <VideoCard
                                key={v?.post?.id}
                                video={v}
                                handleVideoClick={handleVideoClick}
                            />
                        ))
                        : <p className='italic text-center h-full'>No such video found!</p>}
            </div>
        </div>
    );
};

export default SearchResults;
