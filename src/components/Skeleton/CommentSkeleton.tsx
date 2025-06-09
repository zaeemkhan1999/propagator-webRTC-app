import Skeleton from '@mui/material/Skeleton';

const CommentSkeleton = () => {
    return (
        <div className="mb-5 flex w-full items-center justify-between">
            <div className="mb-3 flex w-full items-start gap-3">
                <Skeleton variant="circular" width={45} height={45} className="bg-gray-200 min-w-[45px]" animation="wave" />
                <div style={{ width: 'calc(100% - 20px)' }}>
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton variant="text" width={100} height={20} className="bg-gray-200 " animation="wave" />
                            <Skeleton variant="text" width={70} height={20} className="bg-gray-200 " animation="wave" />
                        </div>
                        <Skeleton variant="circular" width={24} height={24} className="bg-gray-200 " animation="wave" />
                    </div>

                    <Skeleton variant="text" width="90%" height={20} className="mt-2 mb-1 bg-gray-200 " animation="wave" />
                    <Skeleton variant="text" width="30%" height={20} className=" bg-gray-200 " animation="wave" />
                </div>
            </div>
        </div>
    );
};

export default CommentSkeleton;
