import { useRef } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import SkinVideoJs from "@/components/SkinVideoJs";
import { parsePostItems } from "@/components/Grid/utils";
import { Slice } from "@/helper";

interface Props {
    video: any;
    handleVideoClick: (id: number) => void;
};

const ShortsCard: React.FC<Props> = ({ video, handleVideoClick }) => {

    const postItemsRef = useRef(parsePostItems(video?.postItemsString || '[]'));

    return (
        <Card
            className="relative min-w-[140px] md:min-w-52 bg-slate-800 rounded-xl shadow-lg overflow-hidden"
            onClickCapture={() => handleVideoClick(video?.post?.id)}
        >
            <div className="relative h-[250px] md:h-80 overflow-hidden">
                <SkinVideoJs
                    src={postItemsRef?.current[0]?.Content || ''}
                    poster={postItemsRef?.current[0]?.ThumNail || ''}
                    className="w-full h-full object-cover"
                    muted
                    autoplay={false}
                    controls={false}
                    loop
                    playsInline
                    responsive
                    preload="none"
                    showDuration
                />
            </div>
            <CardContent className="!p-2 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent">
                <Typography variant="subtitle2" className="font-semibold text-gray-200">{Slice(video?.post?.yourMind, 15)}</Typography>
                <Typography className="text-gray-100 text-xs truncate">{video?.post?.poster?.username}</Typography>
            </CardContent>
        </Card>
    );
};

export default ShortsCard;
