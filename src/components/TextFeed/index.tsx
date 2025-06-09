import React, { useEffect, useRef, useState } from "react";
import { ExploreText } from "../../types/Feed";
import {
  DaysAgo,
  truncateString,
} from "../../app/utility/misc.helpers";
import {
  IconBookmark,
  IconDots,
  IconEye,
  IconHeart,
  IconInfoTriangleFilled,
  IconLink,
  IconMessageCircle,
  IconPlus,
  IconSend,
  IconUser,
  IconUserOff,
} from "@tabler/icons-react";
import Title from "../Typography/Title";
import userIMG from "../../assets/images/avatar.png";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import MobileIcons from "../Feed/MobileIcons";
import { useNavigate } from "react-router";
import Comment from "@/assets/icons/Comment";
import Share from "@/assets/icons/Share";
import UserAvatar from "../Stories/components/UserAvatar";

const TextFeed = ({ post, userId }: { post: ExploreText, userId: number }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [canFitScreen, setCanFitScreen] = useState(false);
  const [desHeight, setDesHeight] = useState(false);
  const [isCommentLiked, setIsCommentLiked] = useState<number | null>(null);
  const [replyCommentId, setReplyCommentId] = useState<number | null>(null);
  const [showMoreReplies, setShowMoreReplies] = useState(false);

  const [replyText, setReplyText] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);

  const contentRef = useRef<HTMLDivElement>(null);

  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  interface Reply {
    userName: string;
    content: string;
  }

  interface Comment {
    id: number;
    userName: string;
    userIMG: string;
    postedAt: Date;
    content: string;
    replies: Reply[];
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        userName: "User",
        userIMG: userIMG,
        postedAt: new Date(),
        content: newComment,
        replies: [],
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  const handleAddReply = (commentId: number) => {
    if (replyText.trim()) {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
              ...comment,
              replies: [
                ...comment.replies,
                { userName: "You", content: replyText },
              ],
            }
            : comment,
        ),
      );
      setReplyText("");
      setReplyCommentId(null);
    }
  };

  const handleVideoInView = (entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting && contentRef.current) {
      const boundingRect = contentRef.current.getBoundingClientRect();
      const availableScreenHeight = window.innerHeight - 66;

      if (availableScreenHeight < boundingRect.height) {
        setCanFitScreen(true);
      } else {
        setCanFitScreen(false);
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        handleVideoInView(entry);
      },
      { threshold: 0.5 },
    );

    const currentContentRef = contentRef.current;
    if (currentContentRef) {
      observer.observe(currentContentRef);
    }

    return () => {
      if (currentContentRef) {
        observer.unobserve(currentContentRef);
      }
    };
  }, [window.innerHeight]);

  const handleLike = () => setIsLiked(!isLiked);

  const handleBookmark = () => setIsBookmarked(!isBookmarked);

  const handleCommentToggle = (e: any) => {
    e?.stopPropagation();
    setShowComments(!showComments);
  };

  return (
    <div
      className={`text-dark relative w-full  snap-start overflow-hidden bg-gray-100`}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex gap-2 items-center">
          <UserAvatar
            user={post?.post?.poster}
            isSelf={userId === post.post.poster?.id}
            size="10"
          />
          <span
            onClick={() => navigate(`/specter/userProfile/${post?.post?.poster?.id}`)}
            className="font-semibold">
            {post.post.poster.username}
          </span>
        </div>
        <IconDots
          className="cursor-pointer"
          onClick={() => setIsBottomSheetOpen(true)}
        />
      </div>

      <div ref={contentRef} className={`${isBottomSheetOpen ? "blur-sm" : ""}`}>
        <div className="px-4">
          {post.post.yourMind}
        </div>
      </div>

      {canFitScreen
        ? <div
          className={`absolute bottom-[60px] z-50 h-48 w-full md:bottom-0`}
        >
          <div className="mr-6 flex h-full flex-col items-end gap-6">
            <MobileIcons
              variant="text-white"
              icon={
                <IconHeart
                  className={`cursor-pointer ${isLiked ? "fill-current text-green-500" : ""}`}
                />
              }
              onclick={handleLike}
              value={post.likeCount}
            />

            <MobileIcons
              variant="text-white"
              icon={<Comment className="cursor-pointer" />}
              onclick={handleCommentToggle}
              value={post.commentCount}
            />

            <MobileIcons
              variant="text-white"
              icon={<Share className="cursor-pointer" />}
            />

            <IconDots
              className="cursor-pointer"
              onClick={() => setIsBottomSheetOpen(true)}
            />
          </div>
          <div className="absolute bottom-14 left-6 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-[1px] border-gray-400">
                <IconUser size={24} className="text-gray-400" />
              </div>
              <Title className="text-white md:text-base">
                {post.post.poster.username}
              </Title>
              <div className="rounded-lg border-[1px] border-solid border-gray-100 px-1">
                <Title className="text-xs text-white md:text-sm">
                  Follow
                </Title>
              </div>
            </div>
            <div className="cursor-pointer transition-all duration-700 ease-in-out">
              <Title
                onclick={() => setDesHeight((prev) => !prev)}
                className="text-xs text-white md:text-base"
              >
                {desHeight
                  ? post.post.yourMind
                  : truncateString(post.post.yourMind, 80)}
              </Title>
            </div>
          </div>
        </div>
        : <div className="p-4" style={{ borderBottom: "1px solid lightgray" }}>
          <div className="mb-2 flex justify-between">
            <div className="flex space-x-4">
              <IconHeart
                className={`cursor-pointer ${isLiked ? "fill-current text-green-500" : ""}`}
                onClick={handleLike}
              />
              <IconMessageCircle
                className="cursor-pointer"
                onClick={handleCommentToggle}
              />
              <IconSend className="cursor-pointer" />
            </div>
            <IconBookmark
              className={`cursor-pointer ${isBookmarked ? "text-yellow-500 fill-current" : ""}`}
              onClick={handleBookmark}
            />
          </div>

          {post.commentCount > 0 && (
            <div
              className="text-dark mt-1 cursor-pointer"
              onClick={handleCommentToggle}
            >
              View all {post.commentCount} comments
            </div>
          )}

          <div className="mt-2 text-xs text-gray-500">
            {DaysAgo(post.post.postedAt)}
          </div>
        </div>}

      {/* More options */}
      {isBottomSheetOpen && <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        maxW="md"
      >
        <div className="py-2 text-black1">
          <div className="mb-4 flex justify-around border-b border-gray-200 pb-4">
            <div className="flex flex-col items-center">
              <IconBookmark size={24} className="mb-1 text-blue2" />
              <span className="text-xs text-blue2">Save</span>
            </div>
            <div className="flex flex-col items-center">
              <IconLink size={24} className="mb-1 text-blue2" />
              <span className="text-xs text-blue2">Get Link</span>
            </div>
            <div className="flex flex-col items-center">
              <IconInfoTriangleFilled size={24} className="mb-1 text-blue2" />
              <span className="text-xs text-blue2">Report</span>
            </div>
          </div>
          <div className="cursor-pointer px-4 py-3 hover:bg-gray-100">
            <IconEye className="mr-2 inline text-blue2" size={24} />
            <span className="text-base text-blue2">Not Intersted</span>
          </div>
          <div className="flex cursor-pointer items-center px-4 py-3 hover:bg-gray-100">
            <IconUserOff className="mr-2 inline text-blue2" size={24} />
            <span className="text-base text-blue2">Block</span>
          </div>
        </div>
      </BottomSheet>}

      {/* Comments Section */}
      {showComments && <BottomSheet
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        maxW="lg"
      >
        <div className="px-3 py-4 text-black1">
          <div className="text-xxl mb-3 flex items-center justify-between border-b border-gray-100 pb-4 text-center font-bold">
            <div></div>
            <h2>Comments</h2>
            <div>
              <IconSend className="text-bold text-gray-500" />
            </div>
          </div>
          <div className="mt-2">
            {comments.map((comment) => (
              <div
                className="mb-5 flex items-center justify-between"
                key={comment.id}
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 min-w-12 rounded-full bg-gray-200">
                    <img src={comment.userIMG} alt="user-image" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold">
                        {comment.userName}
                      </p>
                      <div className="text-xs text-gray-500">
                        {DaysAgo(comment.postedAt)}
                      </div>
                    </div>
                    <span className="text-sm">{comment.content}</span>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-gray-500">420 likes</p>
                        <p
                          className="cursor-pointer text-xs text-gray-500"
                          onClick={() => setReplyCommentId(comment.id)}
                        >
                          Reply
                        </p>
                      </div>
                    </div>
                    {/* Replies Section */}
                    {comment.replies.length > 0 && (
                      <div>
                        {comment.replies
                          .slice(
                            0,
                            showMoreReplies ? comment.replies.length : 2,
                          )
                          .map((reply, index) => (
                            <div
                              key={index}
                              className="ml-2 mt-2 flex items-start gap-3"
                            >
                              <div className="h-8 w-8 min-w-8 rounded-full bg-gray-200">
                                <img src={userIMG} alt="user-image" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold">
                                  {reply.userName}
                                </p>
                                <span className="text-sm">{reply.content}</span>
                              </div>
                            </div>
                          ))}
                        {comment.replies.length > 2 && !showMoreReplies && (
                          <button
                            className="text-dark ml-2 mt-2 cursor-pointer text-xs"
                            onClick={() => setShowMoreReplies(true)}
                          >
                            View {comment.replies.length - 2} more replies
                          </button>
                        )}
                        {showMoreReplies && (
                          <button
                            className="text-dark ml-2 mt-2 cursor-pointer text-xs"
                            onClick={() => setShowMoreReplies(false)}
                          >
                            Hide replies
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <IconHeart
                  className={`cursor-pointer ${isCommentLiked === comment?.id
                    ? "fill-current text-green-500"
                    : "text-gray-900"
                    }`}
                  size={20}
                  onClick={() => setIsCommentLiked(comment?.id)}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex w-full items-center gap-3 py-3">
            <div className="h-12 w-12 min-w-12 overflow-hidden rounded-[50%]">
              <img src={userIMG} alt="userImage" />
            </div>
            <div className="flex grow items-center gap-2 rounded-[50px] border border-gray-400 p-3">
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
              <IconPlus />
              <IconSend
                className="cursor-pointer text-sm text-gray-500"
                width={18}
                height={18}
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
              />
            </div>
          </div>
        </div>
      </BottomSheet>}
    </div>
  );
};

export default React.memo(TextFeed);
