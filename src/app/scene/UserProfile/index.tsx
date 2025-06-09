import { useState, useMemo, useEffect, lazy } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import {
  Tab,
  TabContext,
  TabList,
  TabListProps,
  TabPanel,
} from "@/components/Tabs";
import Header from "@/components/Header";
import CustomGrid from "@/components/Grid/CustomGrid";
import Lottie from "lottie-react";
import NoData from "../../utility/Nodata.json";
import useGetPosts, { PER_PAGE_COUNT } from "../Profile/query/getPosts";
import { PostItem } from "../Profile/PostTypes";
import { useFollowUserMutation } from "./mutations/followUser";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import useGetUserInfoById from "./queries/getUserInfoById";
import useGetUserFollowings from "./queries/getUserFollowings";
import useGetUserFollowers from "./queries/getUserFollowers";
import { useFollowUnFollowUserMutation } from "./mutations/unfollowUser";
import ProfilePosts from "../Profile/components/ProfilePosts";
import { enqueueSnackbar } from "notistack";
import useIsSuperAdminAndIsProfessionalAccount from "@/hooks/useIsSuperAdminAndIsProfessionalAccount";
import { useDeletePost } from "../Admin/mutations/deletePost";
import { useInView } from "react-intersection-observer";

const BottomSheet = lazy(() => import("@/components/BottomSheet/BottomSheet"));
const UserAvatar = lazy(() => import("@/components/Stories/components/UserAvatar"));
const ProfileMarket = lazy(() => import("../Home/components/FreeMarket/components/ProfileMarket"));

export interface PostData {
  id: number;
  postItemsString: string;
  text: string;
};

const tabItems = [
  { id: "Market", label: "Market" },
  { id: "Posts", label: "Posts" },
  { id: "Scrolls", label: "Scrolls" }
];

const UserProfile = () => {

  const param = useParams();
  const userId: number | null = param?.userId ? parseInt(param.userId) : null;

  const user = useSnapshot(userStore.store).user;
  const navigate = useNavigate();

  const [isSuperAdmin] = useIsSuperAdminAndIsProfessionalAccount();

  const searchParams = new URLSearchParams(window.location.search);
  const tab = useMemo(() => (searchParams.get('Tab') && tabItems.some(t => t.id === searchParams.get('Tab')))
    ? searchParams.get('Tab')!
    : "Posts", [searchParams]);

  const [selectedTab, setSelectedTab] = useState("Posts");
  const [showPost, setShowPost] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<PostItem | null>(null);
  const [showFollowingsModal, setShowFollowingsModal] = useState<null | "Followers" | "Followings">(null);

  const handleTabChange: TabListProps["onChange"] = (
    event: React.SyntheticEvent,
    newValue: string,
  ) => {
    setSelectedTab(newValue);
    navigate(`/specter/userProfile/${userId}?Tab=${newValue}`);
  };

  useEffect(() => {
    setSelectedTab(tab);
  }, [tab]);

  useEffect(() => {
    !searchParams.get('post') && setShowPost(false);
  }, [searchParams.toString()]);

  const { data: userData, getData: fetchUserData, setData: setUserData, isFetched } = useGetUserInfoById();

  const { data, getData, isFetching, hasNextPage, fetchNextPage, total } = useGetPosts({
    where: {
      post: {
        isCreatedInGroup: { eq: false },
        posterId: { eq: userId },
      },
    },
    order: [{ post: { createdDate: "DESC" } }],
  });

  useEffect(() => {
    if (userId) {
      getData();
      fetchUserData(userId, user?.id!);
    } else {
      navigate('/specter/home');
    };
  }, []);

  const handleNavigateToFullscreen = (id: number, index: number) => {
    const page = Math.max(1, Math.ceil((index + 1) / PER_PAGE_COUNT));
    navigate(`/specter/userProfile/${userId}?post=${id}&page=${page}`);
    setShowPost(true);
  };

  const extractedPostsData = useMemo<PostData[]>(() => {
    return !data.length
      ? []
      : data?.map(item => {
        if (!item || !item.post) {
          console.warn("Item or post is undefined. Skipping item.");
          return null;
        }

        try {
          const postItems: PostItem[] = JSON.parse(
            item.postItemsString || "[]",
          );

          return {
            id: item.post.id,
            postItemsString: JSON.stringify([{
              Content: postItems[0]?.Content,
              ThumNail: postItems[0]?.ThumNail || null,
            }]),
            post: {
              yourMind: item?.post?.yourMind || '',
            }
          };
        } catch (e) {
          console.error("Error parsing postItemsString:", e);
          return {
            id: item.post.id,
            postItemsString: "[]",
            text: item?.post?.yourMind
          };
        }
      }).filter((item): item is PostData => item !== null)
  }, [data]);

  const {
    data: followerData,
    getData: getFollowerData,
    fetchNextPage: fetchNextPageFollower,
    hasNextPage: hasNextPageFollower,
    isFetching: isFetchingFollower,
    isLoading: isLoadingFollower
  } = useGetUserFollowers(userId ?? undefined);

  const {
    data: followingData,
    getData: getFollowingData,
    fetchNextPage: fetchNextPageFollowing,
    hasNextPage: hasNextPageFollowing,
    isFetching: isFetchingFollowing,
    isLoading: isLoadingFollowing
  } = useGetUserFollowings(userId ?? undefined);

  useEffect(() => {
    showFollowingsModal === "Followings"
      ? getFollowingData()
      : showFollowingsModal === "Followers"
        ? getFollowerData()
        : null;
  }, [showFollowingsModal]);

  const { ref: lastFollowerRef } = useInView({
    triggerOnce: false,
    threshold: 0.5,
    onChange: inView => {
      if (inView && hasNextPageFollower && !isFetchingFollower && !isLoadingFollower) {
        fetchNextPageFollower();
      };
    },
  });

  const { ref: lastFollowingRef } = useInView({
    triggerOnce: false,
    threshold: 0.5,
    onChange: inView => {
      if (inView && hasNextPageFollowing && !isFetchingFollowing && !isLoadingFollowing) {
        fetchNextPageFollowing();
      };
    },
  });

  const handleShowFollowers = () => {
    setShowFollowingsModal("Followers");
  };

  const handleShowFollowings = () => {
    setShowFollowingsModal("Followings");
  };

  const { mutate: followUser } = useFollowUserMutation({
    onSuccess: (response) => {
      if (response?.follow_followUser?.status?.value === "Success") {
        enqueueSnackbar(`You are now following ${userData?.user?.username}!`, { variant: "success", autoHideDuration: 3000 });
        setUserData(prev => prev && ({ ...prev, isFollowing: true, followerCount: prev?.followerCount + 1 }));
      } else {
        enqueueSnackbar(`Failed to follow ${userData?.user?.username}!`, { variant: "error", autoHideDuration: 3000 });
      };
    },
    onError: () => {
      enqueueSnackbar(`Error following ${userData?.user?.username}`, { variant: "error", autoHideDuration: 3000 });
    },
  });

  const { mutate: unfollowUser } = useFollowUnFollowUserMutation({
    onSuccess: (response) => {
      if (response?.follow_unFollowUser?.status?.value === "Success") {
        enqueueSnackbar(`You unfollowed ${userData?.user?.username}!`, { variant: "success", autoHideDuration: 3000 });
        setUserData(prev => prev && ({ ...prev, isFollowing: false, followerCount: prev?.followerCount - 1 }));
      } else {
        enqueueSnackbar(`Failed to unfollow ${userData?.user?.username}!`, { variant: "error", autoHideDuration: 3000 });
      };
    },
    onError: () => {
      enqueueSnackbar(`Error unfollowing ${userData?.user?.username}`, { variant: "error", autoHideDuration: 3000 });
    },
  });

  const handleFollowToggle = () => {
    if (!userId || !user?.id) return;

    const input = {
      followerInput: {
        followerId: user?.id,
        followedId: userId,
      }
    };

    userData?.isFollowing
      ? unfollowUser(input)
      : followUser(input);
  };

  const { deletePost, loading: deletingPost } = useDeletePost();

  const handleDelete = () => {
    isBottomSheetOpen && deletePost({ entityId: isBottomSheetOpen?.Post.id }, () => {
      getData();
      setShowPost(false);
      setIsBottomSheetOpen(null);
    });
  };

  const handleMessageClick = () => {
    navigate(`/specter/inbox/chat/${userData?.user?.username}`, {
      state: {
        props: {
          otherUsername: userData?.user?.username,
          otherUserId: userData?.user?.id,
          otherUserImage: userData?.user?.imageAddress,
          otherUserLastSeen: userData?.user?.lastSeen || "",
          conversationId: 0,
          currentUserId: user?.id,
        }
      }
    });
  };

  return (
    showPost ? (
      <ProfilePosts
        setShowPost={setShowPost}
        isSuperAdmin={isSuperAdmin}
        userData={userData?.user}
        isBottomSheetOpen={isBottomSheetOpen}
        setIsBottomSheetOpen={setIsBottomSheetOpen}
        handleDelete={handleDelete}
        deletingPost={deletingPost}
      />
    ) : (
      <>
        <div className="relative h-screen w-full overflow-y-auto">
          <Header
            handleBack={() => navigate('/specter/home')}
            text={userData?.user?.displayName || "User"}
            showEndIcon={false}
            position="absolute"
          />
          <div className="relative w-full">
            {userData?.user?.cover && <img
              src={userData?.user?.cover}
              className="-z-1 absolute left-0 top-0 h-full w-full brightness-[0.7]"
              alt="Profile Cover"
            />}
            <div
              className={`flex h-[320px] items-center ${!userData?.user?.cover ? "bg-gradient-to-b from-gray-300/50 via-gray-500/60 to-gray-900/80" : "relative"}`}
            >
              <div className="z-[2] flex w-full items-center justify-between px-4">
                <div className="flex w-full items-center justify-between">
                  <div className="w-full">
                    <div className="mb-3 flex items-center gap-6">
                      <UserAvatar
                        user={userData?.user as any}
                        isSelf={user?.id === userData?.user?.id}
                        size="20"
                      />
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-medium capitalize text-white">
                          {userData?.user?.displayName}
                        </h2>
                        <p
                          className={`"bg-transparent text-white border border-white rounded-[25px] !px-2 py-1 !text-[10px]`}
                          onClick={handleFollowToggle}
                        >
                          {userData?.isFollowing ? "Unfollow" : "Follow"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex w-full items-center justify-between space-x-8 text-center text-white">
                        {user?.id !== userData?.user?.id &&
                          <Button
                            variant="outlined"
                            className="!border-[1px] !border-white !text-white !text-[12px] !rounded-full"
                            onClick={handleMessageClick}
                          >
                            Message
                          </Button>}
                        <div>
                          <p className="text-xl font-semibold">
                            {total || 0}
                          </p>
                          <p className="text-sm">Posts</p>
                        </div>
                        <div onClick={handleShowFollowers}>
                          <p className="text-xl font-semibold">
                            {userData?.followerCount || 0}
                          </p>
                          <p className="text-sm">Followers</p>
                        </div>
                        <div onClick={handleShowFollowings}>
                          <p className="text-xl font-semibold">
                            {userData?.follwingCount || 0}
                          </p>
                          <p className="text-sm">Following</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TabContext value={selectedTab}>
            {<div className="absolute z-[10] top-[300px] flex w-full items-center gap-2 bg-transparent px-2">
              <TabList
                className={`z-50 w-full pe-4 text-white`}
                navbarTab
                onChange={handleTabChange}
              >
                {tabItems.map((tab) => (
                  <Tab key={tab.id} label={tab.label} value={tab.id} />
                ))}
              </TabList>
            </div>}

            <TabPanel value="Posts" className="overflow-y-auto">
              <div>
                <CustomGrid
                  postData={extractedPostsData ?? []}
                  isFetching={isFetching}
                  hasNextPage={hasNextPage}
                  fetchNextPage={fetchNextPage}
                  onClick={handleNavigateToFullscreen}
                />
              </div>
            </TabPanel>

            <TabPanel value="Scrolls">
              <Lottie
                loop={false}
                animationData={NoData}
                style={{
                  width: "200px",
                  height: "200px",
                  margin: "0 auto",
                }}
              />
            </TabPanel>

            <TabPanel value="Market">
              {(isFetched && userData?.user)
                ? <ProfileMarket
                  isSelf={false}
                  userId={userData?.user?.id!}
                  username={userData?.user?.username}
                />
                : <div className="text-center"><CircularProgress /></div>}
            </TabPanel>
          </TabContext>
        </div>

        {showFollowingsModal === "Followers" &&
          <BottomSheet
            position="fixed"
            maxW="sm"
            isOpen={showFollowingsModal === "Followers"}
            onClose={() => setShowFollowingsModal(null)}>
            <div className={`${!followerData?.length ? "w-full" : "w-1/3"} mx-auto max-h-screen overflow-y-auto pb-3`}>
              <div className="text-xxl mb-3 flex items-center justify-center border-b border-gray-100 pb-4 text-center font-bold">
                <h2>Followers</h2>
              </div>

              {isLoadingFollowing
                ? <CircularProgress className="text-center" />
                : followerData?.length
                  ? followerData?.map(u => (
                    <div key={u?.follower?.id} className='flex gap-3 items-center py-3'>
                      <UserAvatar
                        user={u.follower}
                        isSelf={u?.follower?.id === user?.id}
                        size="7"
                      />

                      <p className="text-black">{u?.follower?.username}</p>
                    </div>
                  ))
                  : <p className="text-center italic pb-5">You've no follower yet!</p>}

              {isFetchingFollower && <CircularProgress className="text-center" />}
              <div ref={lastFollowerRef}></div>
            </div>
          </BottomSheet>}

        {showFollowingsModal === "Followings" &&
          <BottomSheet
            position="fixed"
            maxW="sm"
            isOpen={showFollowingsModal === "Followings"}
            onClose={() => setShowFollowingsModal(null)}>
            <div className={`${!followingData?.length ? "w-full" : "w-1/3"}  mx-auto max-h-screen overflow-y-auto pb-3`}>
              <div className="text-xxl mb-3 flex items-center justify-center border-b border-gray-100 pb-4 text-center font-bold">
                <h2>Followings</h2>
              </div>

              {isLoadingFollowing
                ? <CircularProgress className="text-center" />
                : followingData?.length
                  ? followingData?.map(u => (u?.followed &&
                    <div
                      key={u?.followed?.id}
                      className='flex gap-3 items-center py-3'>
                      <UserAvatar
                        user={u.followed}
                        isSelf={u?.followed?.id === user?.id}
                        size="7"
                      />
                      <p className="text-black">{u?.followed?.username}</p>
                    </div>
                  ))
                  : <p className="text-center italic pb-5">You're not following anyone yet!</p>}

              {isFetchingFollowing && <CircularProgress className="text-center" />}
              <div ref={lastFollowingRef}></div>
            </div>
          </BottomSheet>}
      </>)
  );
};

export default UserProfile;
