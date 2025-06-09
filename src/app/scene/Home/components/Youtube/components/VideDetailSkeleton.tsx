import { Card, Skeleton, IconButton } from "@mui/material";
import { IconShare, IconDots, IconMessage2 } from "@tabler/icons-react";
import VideoCardSkeleton from "./VideoSkeleton";

const VideoPageSkeleton: React.FC = () => {
    return (
        <main className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <Card className="w-full">
                    <Skeleton variant="rectangular" animation="wave" className="w-full h-[250px] md:h-[500px]  bg-[#272727]" />
                </Card>

                <div className="px-4 pb-2">
                    <Skeleton variant="text" width="60%" height={24} className="bg-[#272727] mt-4" />
                    <Skeleton variant="text" width="40%" height={18} className="bg-[#272727]" />
                </div>

                <div className="bg-black p-2 rounded-lg w-full pb-4">
                    <div className="flex items-center gap-3 p-2">
                        <Skeleton variant="circular" width={40} height={40} className="bg-[#272727]" />
                        <div>
                            <Skeleton variant="text" width={120} height={20} className="bg-[#272727]" />
                            <Skeleton variant="text" width={100} height={16} className="bg-[#272727]" />
                        </div>
                    </div>

                    <div className="flex items-center justify-start gap-2 !text-xs">
                        <Skeleton variant="rectangular" width={80} height={32} className="rounded-full bg-[#272727]" />
                        <IconButton className="bg-[#272727] !text-white px-4 p-2 !rounded-full">
                            <IconMessage2 size={15} />
                        </IconButton>
                        <IconButton className="bg-[#272727] !text-white px-4 p-2 !rounded-full">
                            <IconShare size={15} />
                        </IconButton>
                        <IconButton className="bg-[#272727] text-white !rounded-full">
                            <IconDots size={20} />
                        </IconButton>
                    </div>
                </div>

                <VideoCardSkeleton />
            </div>
        </main>
    );
};

export default VideoPageSkeleton;