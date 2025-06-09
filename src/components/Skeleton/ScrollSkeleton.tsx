import { Skeleton } from '@mui/material'

const ScrollSkeleton = () => {
    return (
        <div className="p-4 py-8 w-100 border-[1px] border-gray-300 rounded-[8px]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 my-2">
                    <Skeleton className="bg-gray-200" variant="circular" width={40} height={40} />
                    <Skeleton className="bg-gray-200" variant="rectangular" width={100} height={15} />
                </div>
                <div>
                    <Skeleton className="bg-gray-200" variant="rectangular" width={30} height={20} />
                </div>
            </div>
            <div className="flex items-center justify-between my-2">
                <div>
                    <Skeleton className="bg-gray-200" variant="text" width={"200px"} height={35} />
                    <Skeleton className="bg-gray-200" variant="text" width={"200px"} height={35} />
                    <Skeleton className="bg-gray-200" variant="text" width={"200px"} height={35} />
                </div>
                <Skeleton className="bg-gray-200 rounded-[12px]" variant="rectangular" width={"150px"} height={100} />
            </div>
            <div className="mt-2 flex item-center justify-between">
                <div className="flex gap-3 items-center">
                    <Skeleton className="bg-gray-200" variant="circular" width={"20px"} height="20px" />
                    <Skeleton className="bg-gray-200" variant="circular" width={"20px"} height="20px" />
                    <Skeleton className="bg-gray-200" variant="circular" width={"20px"} height="20px" />
                </div>
                <Skeleton className="bg-gray-200" variant="circular" width={"20px"} height="20px" />
            </div>
        </div>
    )
}

export default ScrollSkeleton