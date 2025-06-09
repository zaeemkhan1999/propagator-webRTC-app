import { DaysAgo, isVideo } from "@/app/utility/misc.helpers";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import FileUpload from "@/components/FileUploader";
import LazyLoadImg from "@/components/LazyLoadImage";
import { CircularProgress, Typography } from "@mui/material";
import { IconHeart, IconPlus, IconSend, IconUser } from "@tabler/icons-react";
import Lottie from "lottie-react";
import NoData from '../../../../../utility/Nodata.json'
import { LazyLoadImage } from "react-lazy-load-image-component";
import CommentSkeleton from "@/components/Skeleton/CommentSkeleton";
import { memo } from "react";

interface CommentSectionProps {
    isBottomSheetOpen: boolean;
    setIsBottomSheetOpen: (open: boolean) => void;
    loadingComments: boolean;
    comments: Array<any>;
    showMoreReplies: boolean;
    setPostReplies: (replies: Array<any>) => void;
    setShowMoreReplies: (show: boolean) => void;
    user: any;
    replyCommentId: number | string | null | undefined;
    setReplyText: (text: any) => void;
    setNewComment: (comment: any) => void;
    handleAddReply: (replyText?: string | any, commentId?: string | null | any) => void;
    handleAddComment: () => void;
    setReplyCommentId: (arg: any) => void;
    replyText: any;
    newComment: any;
    isContentUploading: any;
    handleAddContent: any;
    setIsContentUploading: (args: any) => void;
    addingComment: any;
}

const CommentSection = memo(({ isBottomSheetOpen, setIsBottomSheetOpen, loadingComments, comments, showMoreReplies, setPostReplies, setShowMoreReplies, user, replyCommentId, setReplyText, setNewComment, handleAddReply, setReplyCommentId, handleAddComment, replyText, newComment, isContentUploading, handleAddContent, setIsContentUploading, addingComment }: CommentSectionProps) => {
    return (
        <BottomSheet
            isOpen={isBottomSheetOpen}
            onClose={() => setIsBottomSheetOpen(false)}
            maxW="lg"
            position="fixed"
        >
            <div className="relative h-[500px] px-3 py-4 text-black1">
                <div className="text-xxl mb-3 flex items-center justify-center border-b border-gray-100 pb-4 text-center font-bold">
                    <h2>Comments</h2>
                </div>
                <div className="mt-2 h-[360px] w-full overflow-y-auto">
                    {loadingComments ? (
                        <div className="text-center">
                            <CommentSkeleton />
                        </div>
                    ) : comments.length ? (
                        comments.map((comment) => (
                            <div
                                className="mb-5 flex w-full items-center justify-between"
                                key={comment?.articleComment?.id}
                            >
                                <div className="mb-3 flex w-full items-start gap-3">
                                    <div className="h-[45px] w-[45px] min-w-[45px] overflow-hidden rounded-full bg-gray-200">
                                        {comment?.articleComment?.user?.imageAddress ? (
                                            <LazyLoadImage
                                                className="h-full w-full"
                                                src={
                                                    comment?.articleComment?.user?.imageAddress || ""
                                                }
                                                alt="user-image"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <IconUser />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ width: "calc(100% - 20px)" }}>
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <p className="text-sm font-semibold">
                                                    {comment?.articleComment?.user?.username}
                                                </p>
                                                <div className="text-xs text-gray-500">
                                                    {DaysAgo(comment?.articleComment?.createdDate)}
                                                </div>
                                            </div>
                                            <IconHeart
                                                size={20}
                                                strokeWidth={1}
                                                className="text-gray-200"
                                            />
                                        </div>

                                        {comment?.articleComment?.text ? (
                                            <span className="text-sm text-black">
                                                {comment?.articleComment?.text}
                                            </span>
                                        ) : isVideo(comment?.articleComment?.contentAddress) ? (
                                            <video
                                                src={comment?.articleComment?.contentAddress}
                                                autoPlay
                                                muted
                                                style={{ borderRadius: 8, maxHeight: "200px" }}
                                            />
                                        ) : !isVideo(comment?.articleComment?.contentAddress) ? (
                                            <LazyLoadImg
                                                src={comment?.articleComment?.contentAddress}
                                                alt="Media"
                                                height={"200px"}
                                                width={"200px"}
                                                style={{
                                                    objectFit: "cover",
                                                    borderRadius: 8,
                                                    maxHeight: "200px",
                                                }}
                                            />
                                        ) : null}

                                        <div>
                                            <div className="flex items-center gap-3">
                                                <p className="text-xs text-gray-500">
                                                    {comment?.likeCount} like(s)
                                                </p>
                                                <p className="cursor-pointer text-xs text-gray-500">
                                                    Reply
                                                </p>
                                            </div>
                                        </div>

                                        {/* Replies Section */}
                                        {comment?.articleComment?.children?.length ? (
                                            <div>
                                                {comment?.articleComment?.children
                                                    .slice(0, showMoreReplies ?
                                                        comment?.articleComment?.children.length
                                                        : 2)
                                                    .map((reply: any, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="ml-2 mt-3 flex w-[95%] items-start justify-between gap-3"
                                                        >
                                                            <div className="flex items-start gap-3">
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
                                                                    <p className="text-sm font-semibold">
                                                                        {reply?.user?.username}
                                                                    </p>
                                                                    <span className="text-sm">
                                                                        {reply?.text}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <IconHeart size={20} />
                                                        </div>
                                                    ))}

                                                {comment?.articleComment?.children?.length > 2 &&
                                                    !showMoreReplies && (
                                                        <button
                                                            className="ml-2 mt-2 cursor-pointer text-xs text-gray-500"
                                                            onClick={() => {
                                                                if (comment?.articleComment?.children
                                                                    && comment?.articleComment?.children?.length > 2
                                                                ) {
                                                                    setPostReplies(comment?.articleComment?.children?.slice(2) || []);
                                                                }
                                                                setShowMoreReplies(true);
                                                            }}
                                                        >
                                                            View
                                                            {comment?.articleComment?.children?.length - 2}
                                                            more replies
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
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
                            <Typography className="text-center italic">
                                Be the first to comment
                            </Typography>
                            <Lottie
                                loop={false}
                                animationData={NoData}
                                style={{ width: "200px", height: "200px", margin: "0 auto" }}
                            />
                        </>
                    )}
                </div>

                <div className="absolute bottom-0 left-2 mt-3 flex w-[95%] items-center gap-3 py-3">
                    <div className="h-10 w-10 overflow-hidden rounded-[50%] border border-gray-300">
                        {user.user?.imageAddress ? (
                            <LazyLoadImage className="h-full w-full" src={user.user?.imageAddress} alt="userImage" />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[50%] border">
                                <IconUser />
                            </div>
                        )}
                    </div>
                    <div className="flex grow items-center gap-2 rounded-[50px] border border-gray-300 p-1 px-3">
                        <div className="grow">
                            <input
                                placeholder={
                                    replyCommentId ? "Write a reply..." : "Add Your Comment"
                                }
                                className="w-full text-sm focus:outline-none"
                                type="text"
                                value={replyCommentId ? replyText : newComment}
                                onChange={(e) =>
                                    replyCommentId
                                        ? setReplyText(e.target.value)
                                        : setNewComment(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (replyCommentId) {
                                            handleAddReply(replyCommentId);
                                            setReplyText("");
                                            setReplyCommentId(null);
                                        } else {
                                            handleAddComment();
                                            setNewComment("");
                                        }
                                    }
                                }}
                            />
                        </div>

                        {isContentUploading > 0
                            ? <CircularProgress size={18} />
                            : <FileUpload
                                onFileUpload={(file: any, url: any) => {
                                    handleAddContent(url);
                                }}
                                customUI={<IconPlus />}
                                setProgress={setIsContentUploading}
                            />}

                        {addingComment
                            ? <CircularProgress size={18} />
                            :
                            <IconSend
                                className="cursor-pointer text-sm me-2 text-gray-500"
                                width={22}
                                height={22}
                                onClick={() => {
                                    if (replyCommentId) {
                                        handleAddReply(replyCommentId);
                                        setReplyText("");
                                        setReplyCommentId(null);
                                    } else {
                                        handleAddComment();
                                        setNewComment("");
                                    }
                                }}
                            />}
                    </div>
                </div>
            </div>
        </BottomSheet>
    );
});

export default CommentSection;
