import { Typography } from "@mui/material";
import VideoCard from "./VideoCard";
import { useNavigate } from "react-router-dom";

const UpNextVideos = ({ videos, currentId }: { videos: any[], currentId: number }) => {

    const navigate = useNavigate();

    const handleVideoClick = (id: number) => {
        if (id) {
            navigate(`/specter/youtube/watch/${id}`, { state: { props: { nextVideos: videos } }, viewTransition: true });
            setTimeout(() => {
                window.scrollTo(-10000, -10000);
            }, 10);
        };
    };

    return (
        <div className="min-w-[300px]">
            <Typography variant="h6" className="text-white mb-2 px-2">Up Next</Typography>

            {videos.map(v => (currentId !== v?.post?.id &&
                <VideoCard
                    key={v?.post?.id}
                    video={v}
                    handleVideoClick={handleVideoClick}
                />
            ))}
        </div>
    );
};

export default UpNextVideos;
