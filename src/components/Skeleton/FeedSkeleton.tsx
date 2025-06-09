import { Skeleton } from '@mui/material'

const FeedSkeleton = () => {
    return (
        <div className="flex flex-col bg-[#4f4f4f] justify-end items-end h-dvh w-full snap-start snap-always">
            <div className="pb-[80px] p-4 h-fit w-full">
                <div className="flex flex-col gap-2 ">
                    <div className="flex items-center gap-3">
                        <Skeleton
                            variant="circular"
                            width={40}
                            height={40}
                            className="bg-[#f4f4f4]"
                        />
                        <Skeleton
                            variant="text"
                            width="40%"
                            height={20}
                            className="bg-[#f4f4f4]"
                        />
                        <Skeleton
                            variant="text"
                            width={50}
                            height={20}
                            className="bg-[#f4f4f4]"
                        />
                    </div>
                    <Skeleton
                        variant="text"
                        width="80%"
                        height={20}
                        className="bg-[#f4f4f4]"
                    />
                    <Skeleton
                        variant="text"
                        width="80%"
                        height={20}
                        className="bg-[#f4f4f4]"
                    />
                </div>
            </div>
        </div>
    )
}

export default FeedSkeleton