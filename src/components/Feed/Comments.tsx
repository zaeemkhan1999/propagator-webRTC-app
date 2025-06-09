import { memo, useEffect, useState } from "react";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import { CircularProgress } from "@mui/material";
import FileUpload from "../FileUploader";
import { useCreateComment } from "../../app/services/mutations/createComment.mutation";
import { useGetComments } from "../../app/services/Queries/getComments.query";
import { useSnapshot } from "valtio";
import { userStore } from "../../store/user";
import { useLikeComment_LikeCommentMutation } from "../../app/services/mutations/likeComment.mutation";
import { CommentType, SortEnumType } from "../../constants/storage/constant";
import { IconPlus, IconSend, IconTrash, IconUser } from "@tabler/icons-react";
import LazyLoadImg from "../LazyLoadImage";
import CommentSkeleton from "../Skeleton/CommentSkeleton";
import Comment from "./Comment";
import Modal from "../Modals/Modal";
import { useLikeComment_UnLikeCommentMutation } from "@/app/services/mutations/unlikeComment.mutation";
import { useRemoveComment } from "@/app/services/mutations/removeComment.mutation";
import { enqueueSnackbar } from "notistack";
import useIsSuperAdminAndIsProfessionalAccount from "@/hooks/useIsSuperAdminAndIsProfessionalAccount";
import { IsPermissionEnable } from "@/app/utility/permission.helper";
import { permissionsENUM } from "@/constants/permissions";
import UserSuggestions from "./UserSuggestions";

export interface MentionedUser {
  id: string;
  username: string;
  imageAddress: string;
};

interface Props {
  postId: number | null;
  showComments: boolean;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
  commentsPosition?: any;
  postOwnerId: number;
};

const CommentsSection = memo(({ postId, postOwnerId, setShowComments, showComments, commentsPosition }: Props) => {
  const user = useSnapshot(userStore.store).user;

  const [sortBy, setSortBy] = useState<'Newest' | 'Relevant'>('Newest');
  const [searchTerm, setSearchTerm] = useState("");
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isContentUploading, setIsContentUploading] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [replyCommentId, setReplyCommentId] = useState<number | null>(null);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState<number | null>(null);
  const [mentionedUser, setMentionedUser] = useState<null | MentionedUser>(null);

  const {
    data: comments,
    refetch: getComments,
    isFetching,
    isLoading,
  } = useGetComments({
    skip: 0,
    take: 10,
    loadDeleted: false,
    where: {
      comment: {
        postId: { eq: Number(postId) },
        parentId: { eq: null },
      },
    },
    order: [{ comment: { [sortBy === 'Newest' ? 'id' : 'likeCount']: SortEnumType.Desc } }],
  });

  useEffect(() => {
    showComments && getComments();
  }, [showComments, sortBy]);

  const toggleSortBy = () => setSortBy(prev => (prev === 'Newest' ? "Relevant" : "Newest"));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    setCommentText(value);

    if (showUserSuggestions) {
      const val = value.split('@');
      setSearchTerm(val[1] || '');
    };

    const lastChar = value.charAt(value.length - 1);

    if (lastChar.includes('@') && !showUserSuggestions) {
      setShowUserSuggestions(true);
    } else if (!value.includes('@') && showUserSuggestions) {
      setShowUserSuggestions(false);
    };
  };

  const { mutate: createComment, isPending } = useCreateComment();

  const handleAddComment = () => {
    if (!isPending && commentText.trim()) {
      createComment({
        commentInput: {
          commentType: CommentType.Text,
          postId: postId ? +postId : null,
          text: commentText,
          contentAddress: "",
          ...(mentionedUser?.id && { mentionId: +mentionedUser.id }),
          ...(replyCommentId && { parentId: +replyCommentId })
        },
      },
        {
          onSuccess: () => {
            getComments();
            setCommentText("");
            replyCommentId && setReplyCommentId(null);
            mentionedUser?.id && setMentionedUser(null);
          },
        }
      );
    }
  };

  const handleAddContent = (contentAddress: any) => {
    setCommentText("");
    createComment(
      {
        commentInput: {
          commentType: CommentType.Photo,
          postId: Number(postId),
          text: "",
          contentAddress,
        },
      },
      {
        onSuccess: () => {
          setIsContentUploading(0);
          getComments();
        },
      },
    );
  };

  const { mutate: likeComment } = useLikeComment_LikeCommentMutation();
  const { mutate: unlikeComment } = useLikeComment_UnLikeCommentMutation();

  const handleCommentLikeUnlike = (commentId: number, isLiked: boolean) => {
    isLiked
      ? unlikeComment({ input: { commentId } })
      : likeComment({ input: { commentId } });
  };

  const handleReplyClick = (commentId: number, user: MentionedUser) => {
    setReplyCommentId(commentId);
    setMentionedUser(user);
    setCommentText(`${commentText} @${user?.username} `);
    document.getElementById("commentInput")?.focus();
  };

  const onCloseSuggestionsModal = () => {
    setSearchTerm('');
    setShowUserSuggestions(false);
  };

  const onSuggestionClick = (u: MentionedUser) => {
    setMentionedUser(u);
    const updatedText = commentText.split('@')[0] + `@${u.username} `;
    setCommentText(updatedText);
    document.getElementById("commentInput")?.focus();
  };

  const handleShowOptions = (id: number) => {
    setShowOptionsModal(id);
  };

  const { mutate: removeComment, isPending: removing } = useRemoveComment();

  const handleDelete = () => {
    showOptionsModal && !removing && removeComment({ entityId: showOptionsModal },
      {
        onError(error) {
          const err = error as any;
          enqueueSnackbar(err?.comment_removeComment?.value || "Something went wrong", { autoHideDuration: 3000, variant: "error" });
        },
        onSuccess: () => {
          getComments();
          setShowOptionsModal(null);
        }
      });
  };

  const [isSuperAdmin] = useIsSuperAdminAndIsProfessionalAccount();
  const hasPermission = IsPermissionEnable(permissionsENUM.DeleteEntities);

  return (
    <BottomSheet
      bottom="0px"
      position={commentsPosition}
      isOpen={showComments}
      onClose={() => setShowComments(false)}
      maxW="lg"
    >
      <div className="relative h-[450px] bg-[#272727] px-3 pb-4 text-white">
        <div className="text-xxl mb-3 flex items-center justify-center border-b border-gray-100 pb-4 text-center font-bold">
          <h2>Comments</h2>
        </div>

        {!!comments?.length &&
          <div className="pb-3 text-sm" onClick={toggleSortBy}>
            <span className="px-2 py-1 rounded-xl border-[2px] border-gray-500 italic">{sortBy}</span>
          </div>}

        <div className="mt-2 h-[360px] w-full overflow-y-auto pb-14">
          {(isLoading && !isFetching)
            ? <CommentSkeleton />
            : comments?.length
              ? comments?.map(c => (
                <Comment
                  key={c?.comment?.id}
                  comment={c}
                  handleCommentLikeUnlike={handleCommentLikeUnlike}
                  handleReplyClick={handleReplyClick}
                  showMoreReplies={showMoreReplies}
                  setShowMoreReplies={setShowMoreReplies}
                  handleShowOptions={handleShowOptions}
                  userId={user?.id!}
                  canDelete={hasPermission || isSuperAdmin || postOwnerId === user?.id}
                />
              ))
              : <div className="grid place-items-center">
                <h2 className="italic">Be the first to comment!</h2>
              </div>}

          {isFetching && !isLoading && <CommentSkeleton />}
        </div>

        <div className="absolute bottom-0 left-2 mt-3 flex w-[95%] items-center gap-3 py-3 bg-[#272727]">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-300">
            {user?.imageAddress ? (
              <LazyLoadImg className="w-full h-full object-cover" width={"100%"} height={"100%"} src={user?.imageAddress} alt="userImage" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border">
                <IconUser />
              </div>
            )}
          </div>
          <div className="flex grow items-center gap-2 rounded-[50px] border border-gray-300 p-1 px-3">
            <div className="grow">
              <input
                autoComplete="false"
                id='commentInput'
                placeholder="Comment"
                className="w-full text-sm bg-[#272727] focus:outline-none"
                type="text"
                value={commentText}
                onInput={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment();
                  };
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

            {isPending
              ? <CircularProgress size={18} />
              : <IconSend
                className="cursor-pointer text-sm text-gray-500"
                width={22}
                onClick={handleAddComment}
              />}
          </div>
        </div>
      </div>

      {showUserSuggestions &&
        <UserSuggestions
          show={showUserSuggestions}
          onClose={onCloseSuggestionsModal}
          excludeId={user?.id!}
          searchTerm={searchTerm}
          onClick={onSuggestionClick}
        />}

      {!!showOptionsModal &&
        <Modal
          title='Options'
          isOpen={!!showOptionsModal}
          onClose={() => setShowOptionsModal(null)}>
          <div className="w-1/3 m-auto">
            {removing
              ? <CircularProgress className="text-center" />
              : <div
                onClick={handleDelete}
                className="flex items-center gap-3
               text-red-500 cursor-pointer">
                <IconTrash />
                <p>Remove</p>
              </div>}
          </div>
        </Modal>}
    </BottomSheet>
  );
});

export default CommentsSection;
