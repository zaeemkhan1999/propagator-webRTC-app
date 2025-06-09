import { IconBookmark, IconBookmarkFilled, IconDeviceAnalytics, IconEyeX, IconInfoTriangleFilled, IconLink, IconPhotoShare, IconRecycle, IconTrash, IconUserCancel, IconUserOff } from "@tabler/icons-react";
import { usePost_SavePostMutation } from "../../app/services/mutations/Posts/savePost.mutation";
import { useNotInterestedPost_AddNotInterestedPostMutation } from "../../app/services/mutations/Posts/notInterstedPost.mutation";
import { useSnackbar } from "notistack";
import { PostData } from "../../types/Feed";
import { memo } from "react";
import useIsSuperAdminAndIsProfessionalAccount from "@/hooks/useIsSuperAdminAndIsProfessionalAccount";
import { useDeletePost } from "@/app/scene/Admin/mutations/deletePost";
import { IsPermissionEnable } from "@/app/utility/permission.helper";
import { permissionsENUM } from "@/constants/permissions";
import { useBanUser } from "@/app/scene/Admin/mutations/banUnbanUsers";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import { useCreateMyStory } from "../Stories/mutation/createMyStory";

const MoreOptionDrawer = memo(({
  post,
  isOpen,
  setIsOpen,
  clearMode,
  onDelete
}: {
  post: PostData;
  isOpen: number | null;
  setIsOpen: React.Dispatch<React.SetStateAction<number | null>>;
  clearMode?: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: Function;
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: savePost } = usePost_SavePostMutation();
  const { mutate: notInterestedPost } = useNotInterestedPost_AddNotInterestedPostMutation();

  const handleSavePost = () => {
    savePost({
      postId: post?.post?.id,
      liked: post.isLiked,
    });
    enqueueSnackbar("Post saved successfully", {
      variant: "success",
      autoHideDuration: 2000,
    });
  };

  const handleCopyLink = async () => {
    try {
      const link = `${window.location.protocol}//${window.location.host}/specter/view/post/${post?.post?.id}`
      await navigator.clipboard.writeText(link);

      enqueueSnackbar("Link copied successfully", {
        variant: "success",
        autoHideDuration: 2000,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleNotInterestedPost = () => {
    notInterestedPost({
      input: {
        postId: post?.post?.id,
      },
    });
    enqueueSnackbar("Operation was successful!", {
      variant: "success",
      autoHideDuration: 2000,
    });
  };

  const [isSuperAdmin] = useIsSuperAdminAndIsProfessionalAccount();

  const { deletePost, loading: deletingPost } = useDeletePost();

  const handleDelete = () => {
    isOpen && deletePost({ entityId: isOpen }, () => {
      onDelete(isOpen);
    });
    setIsOpen(null);
  };

  const { banUnbanUser, loading: banningUser } = useBanUser();

  const handleBanUser = () => {
    isOpen && banUnbanUser({ userId: post.post.poster.id, isActive: false }, () => setIsOpen(null));
  };

  const { createMyStory, loading: creatingStory } = useCreateMyStory();

  const handleCreatePostStory = () => {
    createMyStory({ postId: (post?.postId ?? post?.post?.id) }, null, () => setIsOpen(null))
  };

  return (
    <BottomSheet isOpen={isOpen !== null} onClose={() => setIsOpen(null)} maxW="md">
      <div className="py-2 pb-6 text-black1">
        <div className="flex justify-around mb-3 border-b border-gray-200 pb-3">
          <div onClick={handleSavePost} className="flex flex-col items-center">
            {post.isSaved
              ? <IconBookmarkFilled size={24} className="mb-1 text-blue2" />
              : <IconBookmark size={24} className="mb-1 text-blue2" />}

            <span className="text-xs text-blue2">Save</span>
          </div>
          <div onClick={handleCopyLink} className="flex flex-col items-center">
            <IconLink size={24} className="mb-1 text-blue2" />
            <span className="text-xs text-blue2">Get Link</span>
          </div>
          <div className="flex flex-col items-center">
            <IconInfoTriangleFilled size={24} className="mb-1 text-blue2" />
            <span className="text-xs text-blue2">Report</span>
          </div>
        </div>
        <div
          onClick={handleNotInterestedPost}
          className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
        >
          <IconEyeX className="mr-2 inline text-blue2" size={24} />
          <span className="text-base text-blue2">Not Intersted</span>
        </div>
        <div
          onClick={() => clearMode?.(true)}
          className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
        >
          <IconRecycle className="mr-2 inline text-blue2" size={24} />
          <span className="text-base text-blue2">Clear Mode</span>
        </div>
        <div
          onClick={() => clearMode?.(false)}
          className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
        >
          <IconRecycle className="mr-2 inline text-blue2" size={24} />
          <span className="text-base text-blue2">Remove Clear Mode</span>
        </div>
        <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center">
          <IconUserCancel className="mr-2 inline text-blue2" size={24} />
          <span className="text-base text-blue2">Block</span>
        </div>

        <div
          onClick={() => navigate(`/specter/promotions`, { state: { props: { isPromote: true, postId: post?.post?.id } } })}
          className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-blue-400">
          <IconDeviceAnalytics className="mr-2 inline" size={24} />
          <span className="text-base">Promote</span>
        </div>

        {(post?.isYourPost || isSuperAdmin || IsPermissionEnable(permissionsENUM.DeleteEntities))
          ? deletingPost
            ? <div className="text-center"><CircularProgress /></div>
            : <div onClick={handleDelete} className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-red-900">
              <IconTrash className="mr-2 inline" size={24} />
              <span className="text-base">Delete</span>
            </div>
          : null}

        {(isSuperAdmin || IsPermissionEnable(permissionsENUM.BanUsers))
          ? banningUser
            ? <div className="text-center"><CircularProgress /></div>
            : <div onClick={handleBanUser} className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-red-900">
              <IconUserOff className="mr-2 inline" size={24} />
              <span className="text-base">Ban <span className='italic'>{post?.post?.poster?.username}</span></span>
            </div>
          : null}

        {creatingStory
          ? <div className="text-center"><CircularProgress /></div>
          : <div onClick={handleCreatePostStory} className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-purple-500 mb-5">
            <IconPhotoShare className="mr-2 inline" size={24} />
            <span className="text-base">Share to Story</span>
          </div>}
      </div>
    </BottomSheet>
  );
});

export default MoreOptionDrawer;
