import { Comment_GetCommentsQueryItem } from '@/app/services/Queries/getComments.query';
import { DaysAgo } from '@/app/utility/misc.helpers';
import { isVideo } from '@/helper';
import { IconDotsVertical, IconHeart, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import CommentReply from './CommentReply';
import { MentionedUser } from './Comments';

interface Props {
    comment: Comment_GetCommentsQueryItem;
    handleCommentLikeUnlike: Function;
    showMoreReplies: boolean
    setShowMoreReplies: Function;
    handleReplyClick: Function;
    handleShowOptions: Function;
    userId: number;
    canDelete: boolean;
};

const Comment = ({ comment, handleCommentLikeUnlike, showMoreReplies, setShowMoreReplies, handleReplyClick, handleShowOptions, userId, canDelete }: Props) => {

    const [likeData, setLikeData] = useState<{ liked: boolean; count: number }>({ liked: comment?.isLiked || false, count: comment?.likeCount || 0 });

    const handleLikeUnlikeClick = () => {
        const isLiked = likeData.liked;
        setLikeData(prev => ({ liked: !isLiked, count: isLiked ? prev.count - 1 : prev.count + 1 }));
        handleCommentLikeUnlike(comment?.comment?.id, isLiked);
    };

    const handleReplyClickBefore = (user: MentionedUser) => {
        handleReplyClick(comment?.comment?.id, user);
    };

    return (
        <div className="mb-5 flex w-full items-center justify-between">
            <div className="mb-3 flex w-full items-start gap-3">
                <div className="h-[45px] w-[45px] min-w-[45px] overflow-hidden rounded-full bg-gray-200">
                    {comment?.comment?.user?.imageAddress ? (
                        <LazyLoadImage
                            width={"100%"}
                            height={"100%"}
                            className="w-full h-full object-cover"
                            src={comment?.comment?.user?.imageAddress || ""}
                            alt="User Image"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <IconUser />
                        </div>
                    )}
                </div>
                <div style={{ width: "calc(100% - 20px)" }}>
                    <div className="flex w-full items-center justify-between">
                        <div className='flex items-center gap-3'>
                            <p className="text-sm font-semibold">
                                {comment?.comment?.user?.username}
                            </p>
                            <p
                                className="cursor-pointer text-xs text-gray-500"
                                onClick={() => handleReplyClick(comment?.comment?.id, { id: comment?.comment?.user?.id, username: comment?.comment?.user?.username, imageAddress: comment?.comment?.user?.imageAddress })}
                            >
                                Reply
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className='flex items-center'>
                                <IconHeart
                                    className={`mr-1 cursor-pointer ${likeData.liked
                                        ? "fill-current text-green-500"
                                        : "text-gray-200"
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
                            <IconDotsVertical size={20} onClick={() => handleShowOptions(comment?.comment?.id)} />
                        </div>
                    </div>

                    {!!comment?.comment?.text
                        ? <span className="text-sm">{comment?.comment?.text}</span>
                        : isVideo(comment?.comment?.contentAddress)
                            ? <video
                                src={comment.comment.contentAddress ?? ''}
                                autoPlay
                                muted
                                style={{ borderRadius: 8, maxHeight: "200px" }}
                            />
                            : comment.comment.contentAddress && (
                                <LazyLoadImage
                                    src={comment.comment.contentAddress}
                                    alt="Media"
                                    height={"200px"}
                                    width={"200px"}
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        maxHeight: "200px",
                                    }}
                                />
                            )}

                    <div className="text-xs text-gray-500">
                        {DaysAgo(comment?.comment?.createdDate)}
                    </div>

                    {/* Replies Section */}
                    {comment?.comment?.children && (
                        <div>
                            {comment?.comment?.children
                                .slice(0, showMoreReplies ? comment?.comment?.children?.length : 3)
                                .map((reply) => (
                                    <CommentReply
                                        key={reply?.id}
                                        reply={reply}
                                        handleReplyClick={handleReplyClickBefore}
                                        handleCommentLikeUnlike={handleCommentLikeUnlike}
                                        handleShowOptions={handleShowOptions}
                                        userId={userId}
                                        canDelete={canDelete}
                                    />
                                ))}
                            {comment.comment.children.length > 3 &&
                                !showMoreReplies && (
                                    <button
                                        className="ml-2 mt-2 cursor-pointer text-xs text-gray-500"
                                        onClick={() => setShowMoreReplies(true)}
                                    >
                                        View {comment.comment.children.length - 3} more replies
                                    </button>
                                )}
                            {showMoreReplies && (
                                <button
                                    className="ml-2 mt-2 cursor-pointer text-xs text-gray-500"
                                    onClick={() => setShowMoreReplies(false)}
                                >
                                    Hide replies
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Comment;
