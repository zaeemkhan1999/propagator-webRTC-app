import { useRef } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import { IconDotsVertical } from "@tabler/icons-react";
import SkinVideoJs from "@/components/SkinVideoJs";
import { parsePostItems } from "@/components/Grid/utils";
import { isImage, Slice } from "@/helper";
import { DaysAgo } from "@/app/utility/misc.helpers";
import UserAvatar from "@/components/Stories/components/UserAvatar";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";

interface Props {
    video: any;
    handleVideoClick: Function;
    layout?: string;
};

const VideoCard: React.FC<Props> = ({ video, handleVideoClick, layout }) => {
    const postItemsRef = useRef(parsePostItems(video?.postItemsString || '[]'));
    const userId = useSnapshot(userStore.store).user?.id;

    const handleTouchStart = (e: any) => {
        e.target.dataset.startY = e.touches[0].clientY;
        e.target.dataset.startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: any) => {
        const startY = parseFloat(e.target.dataset.startY || "0");
        const startX = parseFloat(e.target.dataset.startX || "0");
        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;

        const deltaY = Math.abs(startY - endY);
        const deltaX = Math.abs(startX - endX);

        if (deltaY < 5 && deltaX < 5) {
            handleVideoClick(video?.post?.id);
        };
    };

    if (!postItemsRef?.current[0]?.Content || isImage(postItemsRef?.current[0]?.Content)) {
        return null;
    };

    return (
        <Card
            className="w-full bg-[#0f0f0f] md:rounded-lg md:shadow-lg overflow-hidden">
            <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative md:rounded-t-lg overflow-hidden">
                <SkinVideoJs
                    src={postItemsRef?.current[0]?.Content || ''}
                    poster={postItemsRef?.current[0]?.ThumNail || ''}
                    className="w-full min-h-[140px] max-h-[400px] overflow-hidden"
                    muted
                    controls={false}
                    autoplay={false}
                    loop={false}
                    playsInline
                    responsive
                    preload="none"
                    showDuration
                    layout={layout}
                />
            </div>
            <CardContent onClickCapture={() => handleVideoClick(video?.post?.id)} className="flex items-center justify-between !p-4">
                <div className="flex items-start gap-2">
                    <UserAvatar
                        user={video?.post?.poster}
                        isSelf={userId === video?.post?.poster?.id}
                        size="10"
                    />
                    <div>
                        <Typography variant="subtitle2" className="font-semibold text-gray-200">{Slice(video?.post?.yourMind, 35)}</Typography>
                        <div className="flex md:block items-center gap-2">
                            <Typography className="text-gray-400 text-xs">{video?.post?.poster?.username}</Typography>
                            <Typography className="text-gray-400 text-xs">{video?.viewCount || 0} views • {DaysAgo(video?.post?.createdDate)}</Typography>
                        </div>
                    </div>
                </div>
                <IconButton><IconDotsVertical size={24} color="white" /></IconButton>
            </CardContent>
        </Card>
    );
};

export default VideoCard;
