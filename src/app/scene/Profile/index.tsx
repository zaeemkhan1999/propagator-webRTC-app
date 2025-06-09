import { IconSearch, IconPlus } from "@tabler/icons-react";
import Header from "@/components/Header";
import { lazy, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TabContext,
  TabList,
  Tab,
  TabPanel,
  TabListProps,
} from "@/components/Tabs";
import CustomGrid from "@/components/Grid/CustomGrid";
import useGetPosts from "./query/getPosts";
import { userStore } from "@/store/user";
import { useSnapshot } from "valtio";
import ProfilePosts from "./components/ProfilePosts";
import { PostItem } from "./PostTypes";
import { useUpdateProfile } from "./mutations/updateProfile";
import { useGetCurrentUser } from "../../services/query/user.query";
import useIsSuperAdminAndIsProfessionalAccount from "@/hooks/useIsSuperAdminAndIsProfessionalAccount";
import { useDeletePost } from "../Admin/mutations/deletePost";
import SearchBar from "../Explore/Components/SearchBar";
import { formatDateForInput } from "@/app/utility/misc.helpers";
import { CircularProgress } from "@mui/material";
import { PostData } from "../UserProfile";
import { PER_PAGE_COUNT } from "./query/getPosts";
import { useInView } from "react-intersection-observer";
import useGetUserFollowings from "../UserProfile/queries/getUserFollowings";
import useGetUserFollowers from "../UserProfile/queries/getUserFollowers";

const Scrolls = lazy(() => import("../Home/components/Scrolls"));
const EditModal = lazy(() => import("./components/EditModal"));
const BottomSheet = lazy(() => import("@/components/BottomSheet/BottomSheet"));
const UserAvatar = lazy(() => import("@/components/Stories/components/UserAvatar"));
const ProfileMarket = lazy(() => import("../Home/components/FreeMarket/components/ProfileMarket"));

export const tabItems = [
  { id: "Market", label: "Market" },
  { id: "Posts", label: "Posts" },
  { id: "Scrolls", label: "Scrolls" },
  { id: "Saved", label: "Long Videos" },
];

export interface editModalData {
  displayName: string;
  username: string;
  imageAddress?: string | null;
  cover?: string | null;
  countryCode: string;
  phoneNumber: string;
  location: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
  url: string;
};

const Profile = () => {
  const navigate = useNavigate();
  const user = useSnapshot(userStore.store)?.user;

  const [isSuperAdmin] = useIsSuperAdminAndIsProfessionalAccount();
  const { fetchCurrentUser } = useGetCurrentUser();

  const searchParams = new URLSearchParams(window.location.search);
  const tab = useMemo(() => (searchParams.get('Tab') && tabItems.some(t => t.id === searchParams.get('Tab')))
    ? searchParams.get('Tab')!
    : "Posts", [searchParams]);

  const [search, setSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFullScrollPost, setSelectedFullScrollPost] = useState<any>(null);
  const [showPost, setShowPost] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(tab);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<PostItem | null>(null);
  const [showFollowingsModal, setShowFollowingsModal] = useState<null | "Followers" | "Followings">(null);

  const initialEditModalData: editModalData = {
    displayName: user?.displayName || "",
    username: user?.username || "",
    imageAddress: user?.imageAddress || "",
    cover: user?.cover || "",
    countryCode: user?.countryCode || "",
    phoneNumber: user?.phoneNumber || "",
    location: user?.location || "",
    dateOfBirth: formatDateForInput(user?.dateOfBirth),
    gender: user?.gender || "",
    bio: user?.bio || "",
    url: user?.linkBio || "",
  };

  const [editModalData, setEditModalData] = useState(initialEditModalData);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const { data, getData, isFetching, hasNextPage, fetchNextPage, total } = useGetPosts({
    where: {
      post: {
        yourMind: {
          contains: searchTerm,
        },
        isCreatedInGroup: {
          eq: false,
        },
        posterId: { eq: user?.id || null },
      },
    },
    order: [{ post: { createdDate: "DESC" } }],
  });

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

  const toggleModal = () => {
    setEditModalData?.(initialEditModalData);
    setShowEditModal((prev) => !prev);
  };

  const handleTabChange: TabListProps["onChange"] = (
    event: React.SyntheticEvent,
    newValue: string,
  ) => {
    setSelectedTab(newValue);
    navigate(`/specter/profile?Tab=${newValue}`);
  };

  useEffect(() => {
    setSelectedTab(tab);
  }, [tab]);

  useEffect(() => {
    !searchParams.get('post') && setShowPost(false);
  }, [searchParams.toString()]);

  const { updateProfile, loading: updatingProfile } = useUpdateProfile();

  const handleSave = () => {
    if (!updatingProfile) {
      const { displayName, username, imageAddress, cover, countryCode, phoneNumber, location, dateOfBirth, gender, bio, url } = editModalData;

      const input = {
        id: user?.id as number,
        bio,
        displayName,
        username,
        dateOfBirth: formatDateForInput(dateOfBirth),
        imageAddress: imageAddress as string,
        cover: cover as string,
        location,
        gender,
        enableTwoFactorAuthentication: false,
        linkBio: url,
        phoneNumber,
        countryCode,
      };

      if (user?.id)
        updateProfile({ input }, function () {
          toggleModal();
          fetchCurrentUser(() => setEditModalData(initialEditModalData));
        });
    }
  };
  const { deletePost, loading: deletingPost } = useDeletePost();

  const handleDelete = () => {
    isBottomSheetOpen &&
      deletePost({ entityId: isBottomSheetOpen?.Post?.id }, () => {
        getData();
        setShowPost(false);
        setIsBottomSheetOpen(null);
      });
  };

  const showSearch = () => {
    setSearch((prev) => !prev);
  };

  useEffect(() => {
    if (selectedTab === "Posts") {
      getData();
    }
  }, [selectedTab]);

  const handleNavigateToFullscreen = (id: number, index: number) => {
    const page = Math.max(1, Math.ceil((index + 1) / PER_PAGE_COUNT));
    navigate(`/specter/profile?post=${id}&page=${page}`);
    setShowPost(true);
  };

  const {
    data: followerData,
    getData: getFollowerData,
    fetchNextPage: fetchNextPageFollower,
    hasNextPage: hasNextPageFollower,
    isFetching: isFetchingFollower,
    isLoading: isLoadingFollower
  } = useGetUserFollowers(user?.id);

  const {
    data: followingData,
    getData: getFollowingData,
    fetchNextPage: fetchNextPageFollowing,
    hasNextPage: hasNextPageFollowing,
    isFetching: isFetchingFollowing,
    isLoading: isLoadingFollowing
  } = useGetUserFollowings(user?.id);

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

  return (
    <div className="relative flex h-screen w-full bg-white">
      <>
        {showPost ? (
          <ProfilePosts
            setShowPost={setShowPost}
            isSuperAdmin={isSuperAdmin}
            userData={user ?? undefined}
            isBottomSheetOpen={isBottomSheetOpen}
            setIsBottomSheetOpen={setIsBottomSheetOpen}
            handleDelete={handleDelete}
            deletingPost={deletingPost}
          />
        ) : (
          <>
            <div className="relative h-full w-full overflow-y-auto overflow-x-hidden">
              <Header
                handleBack={() => navigate('/specter/home')}
                text={user?.username}
                showEndIcon
                position="absolute"
              />
              <div className="relative w-full">
                {user?.cover && <img
                  src={user?.cover || ''}
                  className="-z-1 absolute left-0 top-0 h-full w-full brightness-[0.7]"
                  alt="Profile Cover"
                />}
                <div
                  className={`flex h-[320px] items-center ${!user?.cover ? "bg-gray-900" : "relative bg-gradient-to-t from-black/70 to-transparent"}`}
                >
                  <div className="z-[2] flex w-full items-center justify-between px-4">
                    <div className="flex w-full items-center justify-between">
                      <div className="w-full">
                        <div className="mb-3 flex items-center gap-6">
                          <UserAvatar
                            user={user as any}
                            isSelf
                            size="20"
                          />
                          <h2 className="mt-2 text-xl font-medium capitalize text-white">
                            {user?.displayName}
                          </h2>
                        </div>
                        <div>
                          <div className="flex w-full items-center justify-between space-x-8 text-center text-white">
                            <button
                              onClick={toggleModal}
                              className="rounded-full border border-white bg-transparent px-6 py-1 text-sm text-white"
                            >
                              Edit
                            </button>
                            <div>
                              <p className="text-xl font-semibold">
                                {total || 0}
                              </p>
                              <p className="text-sm">Posts</p>
                            </div>
                            <div onClick={handleShowFollowers}>
                              <p className="text-xl font-semibold">
                                {user?.followerCount || 0}
                              </p>
                              <p className="text-sm">Followers</p>
                            </div>
                            <div onClick={handleShowFollowings}>
                              <p className="text-xl font-semibold">
                                {user?.follwingCount || 0}
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

              {showEditModal && (
                <div>
                  <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-md"
                    onClick={toggleModal}
                  ></div>
                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="max-h-[70vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-4 text-center shadow-lg">
                      <button
                        onClick={toggleModal}
                        className="ml-auto flex items-center rounded-md transition-colors duration-200 hover:text-red-600"
                      >
                        <IconPlus
                          style={{ transform: "rotate(45deg)" }}
                          size={30}
                          className="mr-2"
                        />
                      </button>
                      <EditModal
                        user={user}
                        editData={editModalData}
                        setEditData={setEditModalData}
                        handleSave={handleSave}
                        updatingProfile={updatingProfile}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div
                className={`px-4 ${!selectedFullScrollPost && search ? "h-[64px]" : "h-0 opacity-0"} transition-all duration-500 ease-in-out`}
              >
                <div className="flex items-center gap-2 bg-transparent">
                  <SearchBar
                    className="m-auto my-2 h-12 w-full md:my-4 md:h-14 md:w-[75%]"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    cb={() => { }}
                  />
                </div>
              </div>

              <TabContext value={selectedTab}>
                {<div className="absolute z-[10] top-[285px] flex w-full items-center gap-2 bg-transparent px-2">
                  <IconSearch
                    onClick={showSearch}
                    className="mb-1 text-white"
                  />
                  <TabList
                    className={`left-8 z-50 w-full pe-10 text-white`}
                    navbarTab
                    onChange={handleTabChange}
                  >
                    {tabItems.map((tab) => (
                      <Tab key={tab.id} label={tab.label} value={tab.id} />
                    ))}
                  </TabList>
                </div>}

                <TabPanel value="Market">
                  <ProfileMarket
                    isSelf
                    userId={user?.id!}
                    username={user?.username!}
                  />
                </TabPanel>

                <TabPanel value="Posts">
                  <CustomGrid
                    postData={extractedPostsData}
                    isFetching={isFetching}
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    onClick={handleNavigateToFullscreen}
                  />
                </TabPanel>
                <TabPanel value="Scrolls">
                  <Scrolls
                    yourArticle
                    setSelectedFullScrollPost={setSelectedFullScrollPost}
                  />
                </TabPanel>
                <TabPanel value="Saved">
                  <ProfilePosts
                    isLongVideos
                    setShowPost={setShowPost}
                    isSuperAdmin={isSuperAdmin}
                    userData={user ?? undefined}
                    isBottomSheetOpen={isBottomSheetOpen}
                    setIsBottomSheetOpen={setIsBottomSheetOpen}
                    handleDelete={handleDelete}
                    deletingPost={deletingPost}
                  />
                </TabPanel>
              </TabContext>
            </div>
          </>)}
      </>

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
    </div>
  );
};

export default Profile;
