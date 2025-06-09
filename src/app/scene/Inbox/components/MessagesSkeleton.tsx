import { Skeleton } from "@mui/material";

const MessagesSkeleton = () => {
    return (
        <div className="flex flex-col inset-0 z-10 space-y-3 ">
            {Array(12).fill("").map((_, index) => (
                <div key={index} className={`flex relative ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                    <Skeleton animation='pulse' variant="rectangular" width={200} height={50} className={`rounded-[18px] ${index % 2 === 0 ? "bg-white" : "bg-lime-100"}`}>
                        {index % 2 === 0
                            ? <div className={`absolute -z-1 -bottom-1 left-[-8px] h-0 w-0 rotate-[50deg] border-l-[8px] border-r-[10px] border-t-[15px] border-l-transparent border-r-transparent border-t-white`}></div>
                            : <div className={`absolute -z-1 -bottom-1 right-[-8px] h-0 w-0 rotate-[-50deg] border-l-[10px] border-r-[8px] border-t-[15px] border-l-transparent border-r-transparent border-t-lime-100`}></div>}
                    </Skeleton>
                </div>
            ))}
        </div>
    );
};

export default MessagesSkeleton;
