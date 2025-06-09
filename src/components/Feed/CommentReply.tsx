import { useState } from 'react';
import { type CommentReply } from '@/app/services/Queries/getComments.query';
import { DaysAgo } from '@/app/utility/misc.helpers';
import { IconDotsVertical, IconHeart, IconUser } from '@tabler/icons-react';

interface Props {
    reply: CommentReply;
    handleReplyClick: Function;
    handleCommentLikeUnlike: Function;
    handleShowOptions: Function;
    userId: number;
    canDelete: boolean;
};

const CommentReply = ({ reply, handleReplyClick, handleCommentLikeUnlike, handleShowOptions, userId, canDelete }: Props) => {

    const [likeData, setLikeData] = useState<{ liked: boolean; count: number }>({ liked: reply?.isLiked || false, count: reply?.likeCount || 0 });

    const handleLikeUnlikeClick = () => {
        const isLiked = likeData.liked;
        setLikeData(prev => ({ liked: !isLiked, count: isLiked ? prev.count - 1 : prev.count + 1 }));
        handleCommentLikeUnlike(reply?.id,);
    };

    return (<>
        <div className="ml-2 mt-3 flex w-[95%] items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-full overflow-hidden bg-gray-200">
                    {reply?.user?.imageAddress ? (
                        <img
                            src={reply?.user?.imageAddress || ""}
                            alt="user-image"
                        />
                    ) : (
                        <IconUser />
                    )}
                </div>
                <div>
                    <div className='flex items-center gap-3'>
                        <p className="text-sm font-semibold">
                            {reply?.user?.username}
                        </p>
                        <p
                            className="cursor-pointer text-xs text-gray-500"
                            onClick={() => handleReplyClick({ id: reply?.user?.id, username: reply?.user?.username, imageAddress: reply?.user?.imageAddress })}
                        >
                            Reply
                        </p>
                    </div>
                    <span className="text-sm">{reply?.text}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className='flex items-center'>
                    <IconHeart
                        className={`mr-1 cursor-pointer ${likeData.liked
                            ? "fill-current text-green-500"
                            : "text-gray-900"
                            }`}
                        size={20}
                        strokeWidth={1}
                        onClick={handleLikeUnlikeClick}
                    />
                    {likeData?.count > 0 &&
                        <p className="text-xs text-gray-500">
                            {likeData?.count}
                        </p>}
                </div>
                {(userId === reply?.user?.id || canDelete)
                    && <IconDotsVertical size={20} onClick={() => handleShowOptions(reply?.id)} />}
            </div>

        </div>
        <div className="text-xs text-gray-500 ml-14">
            {DaysAgo(reply?.createdDate)}
        </div>
    </>);
};

export default CommentReply;
