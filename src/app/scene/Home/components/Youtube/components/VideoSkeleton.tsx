import { Card, CardContent, IconButton } from "@mui/material";
import { Skeleton } from "@mui/material";

const VideoCardSkeleton = () => {
    return (
        Array(5).fill('').map((_, i) => (
            <Card key={i} className="w-full border-[1px] border-gray-800 bg-[#272727] md:rounded-lg md:shadow-lg overflow-hidden">
                <div className="relative md:rounded-t-lg overflow-hidden">
                    <Skeleton variant="rectangular" className="w-full min-h-[200px] max-h-[87%]" />
                </div>

                <CardContent className="flex items-center justify-between !p-4">
                    <div className="flex items-start gap-2">
                        <Skeleton variant="circular" width={40} height={40} className="bg-gray-300" />

                        <div>
                            <Skeleton variant="text" width={150} height={20} className="bg-gray-300" />
                            <div className="flex md:block items-center gap-2">
                                <Skeleton variant="text" width={100} height={15} className="bg-gray-300" />
                                <Skeleton variant="text" width={120} height={15} className="bg-gray-300" />
                            </div>
                        </div>
                    </div>

                    <IconButton>
                        <Skeleton variant="circular" width={24} height={24} className="bg-gray-300" />
                    </IconButton>
                </CardContent>
            </Card>))
    );
};

export default VideoCardSkeleton;