import { Card, CardContent, Skeleton } from "@mui/material";

const ShortsSkeleton = () => {
    return (
        <div className="flex gap-4 overflow-x-auto">
            {Array(8).fill('').map((_, i) => (
                <Card key={i} className="relative min-w-[140px] md:min-w-52 bg-[#272727] rounded-xl shadow-lg overflow-hidden">
                    <div className="relative h-[250px] md:h-80 overflow-hidden">
                        <Skeleton variant="rectangular" className="w-full h-full" />
                    </div>

                    <CardContent className="!p-2 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent">
                        <Skeleton variant="text" width={120} height={20} className="bg-gray-200" />
                        <Skeleton variant="text" width={80} height={15} className="bg-gray-200" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ShortsSkeleton;
