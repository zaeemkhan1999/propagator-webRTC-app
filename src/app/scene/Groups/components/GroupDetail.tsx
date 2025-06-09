import {
  useState,
  useEffect,
  SyntheticEvent,
  lazy,
  useRef,
  useMemo,
} from "react";
import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  IconButton,
  CircularProgress,
  Avatar,
  Drawer,
} from "@mui/material";
import {
  IconDotsVertical,
  IconTrash,
  IconPencil,
  IconLogout,
  IconStar,
  IconEdit,
  IconPlus,
  IconArrowLeft,
  IconUsersGroup,
  IconAdjustmentsHorizontal,
  IconUserMinus,
  IconArrowRight,
  IconUserShare,
  IconUsersPlus,
  IconCheck,
} from "@tabler/icons-react";
import { useUpdateGroupMutation } from "../mutations/updateGroup.mutation";
import { useLocation, useNavigate } from "react-router";
import { DiscussionItem, useGetDiscussions } from "../queries/getGroupDiscussion.query";
import { SortEnumType } from "@/constants/storage/constant";
import Lottie from "lottie-react";
import NoData from "../../../utility/Nodata.json";
import { MemberItem, useGetGroupMembers } from "../queries/getGroupMember";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useRemoveGroup } from "../mutations/deleteGroup";
import { useRemoveUserFromGroup } from "../mutations/removeUser";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import {
  Tab,
  TabContext,
  TabList,
  TabListProps,
  TabPanel,
} from "@/components/Tabs";
import { useGetUsers } from "../../Admin/queries/getUsers";
import { useAddUserToGroup } from "../mutations/addUser";
import { useAddGroupTopic } from "../mutations/addGroupTopic";
import { useGetGroupTopics } from "../queries/getGroupTopics";
import { useUpdateGroupTopic } from "../mutations/updateGroupTopic";
import { useRemoveGroupTopic } from "../mutations/removeGroupTopic";
import { GroupItem } from "../queries/getGroup.query";
import { ArticleItem } from "../../Explore/queries/getExploreScrolls";
import { handleOnErrorImage } from "@/helper";
import { useRequestToJoinGroup } from "../mutations/requestToJoin";
import useGetGroupRequests from "../queries/getGroupRequests";
import { useApproveRequest } from "../mutations/approveRequest";

export const GroupPost = lazy(() => import("./GroupPost"));
export const Scrolls = lazy(() => import("../../Home/components/Scrolls"));
const GroupForm = lazy(() => import("./GroupForm"));
const SearchBar = lazy(() => import("../../Explore/Components/SearchBar"));
const SubmitBtn = lazy(() => import("@/components/Buttons"));

export const filterAndSortOptions = [
  {
    label: "Filter",
    options: [
      {
        label: "Posts",
        value: "Posts"
      },
      {
        label: "Scrolls",
        value: "Scrolls"
      }
    ],
  },
  {
    label: "Sort By",
    options: [
      {
        label: "Newest to Oldest",
        value: "Desc"
      },
      {
        label: "Oldest to Newest",
        value: "Asc"
      }
    ],
  },
];

const tabsConfig = [
  { id: "0", label: "" },
  { id: "1", label: "Discussions" },
  { id: "2", label: "Members" },
  { id: "3", label: "Media" },
];

const initialTopicData = {
  id: null,
  title: "",
  action: "Add"
};

type TopicData = {
  id: null | number;
  title: string;
  action: string;
};

const GroupDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { group }: { group: GroupItem } = state?.props || {};
  const queryParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    if (!state || !group) {
      navigate('/specter/groups');
    }
  }, []);

  const user = useSnapshot(userStore.store);
  const lastDiscussionRef = useRef<null | HTMLDivElement>(null);

  const [selectedTab, setSelectedTab] = useState(tabsConfig[1].id);
  const [selectedMediaSubTab, setSelectedMediaSubTab] = useState<number>(0);
  const [openCreateContentModal, setOpenCreateContentModal] = useState<boolean>(false);
  const [openMenuModal, setOpenMenuModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState<boolean>(false);
  const [showAddTopicDialog, setShowAddTopicDialog] = useState<boolean>(false);
  const [topicData, setTopicData] = useState<TopicData>(initialTopicData);
  const [showTopicsMoreOptions, setShowTopicsMoreOptions] = useState<boolean>(false);
  const [selectedFilterAndSort, setSelectedFilterAndSort] = useState<{ filter: "Posts" | "Scrolls"; sort: "Asc" | "Desc" }>(
    { filter: queryParams.get("filter") === "Scrolls" ? "Scrolls" : "Posts", sort: "Desc" });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isTopicsDrawerOpen, setIsTopicsDrawerOpen] = useState<boolean>(false);
  const [showPendingRequest, setShowPendingRequest] = useState(false);

  const { data: discussionData, isLoading: loadingDiscussions, hasNextPage, fetchNextPage, isFetching, refetch: refetchDiscussions } = useGetDiscussions({
    skip: 0,
    take: 10,
    where: {
      conversationId: { eq: group?.conversationId },
      isDeleted: { neq: true },
      groupTopicId: { eq: null },
      messageType: {
        eq: selectedFilterAndSort.filter === "Posts"
          ? "POST"
          : "ARTICLE"
      }
    },
    order: { createdDate: SortEnumType[selectedFilterAndSort.sort] },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (lastDiscussionRef?.current) {
      observer.observe(lastDiscussionRef?.current);
    }

    return () => {
      if (lastDiscussionRef?.current) {
        observer.unobserve(lastDiscussionRef?.current);
      }
    };
  }, [hasNextPage, isFetching, fetchNextPage]);

  useEffect(() => {
    if (selectedTab === "1" && group?.conversationId) {
      refetchDiscussions();
    }
  }, [selectedTab]);

  const {
    getGroupMembers,
    data: membersData,
    refetch: refetchGroupMembers,
    loading: loadingMembers,
    error: errorInGroupMembers
  } = useGetGroupMembers();

  useEffect(() => {
    if (selectedTab === "2" && group?.conversationId && group?.isMemberOfGroup)
      getGroupMembers({ conversationId: group?.conversationId });
  }, [group, selectedTab]);

  const { data: nonGroupMembers, isFetching: isFetchingUsers, refetch: refetchUsers } = useGetUsers({
    searchTerm,
    isActive: true,
    ofTypes: ["USER", "ADMIN", "SUPER_ADMIN"],
    excludeUserIds: membersData?.message_getGroupMembers?.result?.items?.map(u => u.user.id)
  });

  useEffect(() => {
    showAddMemberDialog && searchTerm && refetchUsers();
  }, [showAddMemberDialog]);

  const { deleteGroup, error: errorDeleteGroup } = useRemoveGroup();

  const handleDelete = () => {
    deleteGroup({ conversationId: group?.conversationId });
    if (!errorDeleteGroup) {
      navigate(-1);
    };
  };

  const { removeUserFromGroup, error: errorRemoveUser, loading: removingUser } = useRemoveUserFromGroup();

  const handleRemoveUser = (userId: number) => {
    if (userId && group?.conversationId && group?.adminId === user?.user?.id)
      removeUserFromGroup({
        userId,
        conversationId: group?.conversationId,
      }, () => {
        refetchGroupMembers({ conversationId: group?.conversationId });
      });
  };

  const { addUserToGroup, loading: addingMember } = useAddUserToGroup();

  const handleAddMember = (userId: number) => {
    if (userId && group?.conversationId)
      addUserToGroup({
        userIds: [userId],
        conversationId: group?.conversationId
      }, () => {
        refetchGroupMembers({ conversationId: group?.conversationId });
        setShowAddMemberDialog(false);
        setSearchTerm('');
      });
  };

  const handleLeaveGroup = () => {
    if (user?.user?.id && group?.conversationId)
      removeUserFromGroup({
        userId: user?.user?.id,
        conversationId: group?.conversationId,
      });
    if (!errorRemoveUser) {
      navigate(-1);
    };
  };

  const { updateGroup, loading: isUpdating } = useUpdateGroupMutation();

  const handleUpdateGroup = async (updatedData: any) => {
    const { groupName, link, visibility, coverImage } = updatedData;

    const updatedGroupData = {
      groupName,
      groupDescription: "",
      groupImgageUrl: coverImage || '',
      groupLink: link,
      isPrivate: visibility === "Private",
      conversationId: group?.conversationId,
    };

    updateGroup({ input: updatedGroupData }, () => {
      navigate(-1);
    });
  }

  const { data: groupTopics, isFetching: isFetchingTopics, refetch: refetchTopics, } = useGetGroupTopics({ conversationId: group?.conversationId });

  useEffect(() => {
    if (isTopicsDrawerOpen) refetchTopics();
  }, [isTopicsDrawerOpen]);

  const { addGroupTopic, loading: addingTopic } = useAddGroupTopic();

  const handleAddTopic = () => {
    !addingTopic &&
      topicData.title &&
      addGroupTopic({ conversationId: group?.conversationId, title: topicData.title },
        () => {
          refetchTopics();
          setTopicData(initialTopicData);
          setShowAddTopicDialog(false);
        }
      );
  }

  const { updateGroupTopic, loading: editingTopic } = useUpdateGroupTopic();

  const handleEditTopic = () => {
    !editingTopic && topicData.id && topicData.title && topicData.action === 'Edit' &&
      updateGroupTopic({ groupTopicId: topicData.id, title: topicData.title },
        () => {
          refetchTopics();
          setTopicData(initialTopicData);
          setShowAddTopicDialog(false);
        }
      );
  }

  const { removeGroupTopic, loading: removingTopic } = useRemoveGroupTopic();

  const handleRemoveTopic = () => {
    !removingTopic && topicData.id &&
      removeGroupTopic({ groupTopicId: topicData.id },
        () => {
          refetchTopics();
          setTopicData(initialTopicData);
          setShowTopicsMoreOptions(false);
        }
      );
  }

  const handleTabChange: TabListProps["onChange"] = (
    event: SyntheticEvent,
    newValue: string
  ) => setSelectedTab(newValue);

  const handleCreateContentOpen = () => {
    setOpenCreateContentModal(true);
  };

  const handleCreateContentClose = () => {
    setOpenCreateContentModal(false);
  };

  const handleOpenMenuModal = () => {
    setOpenMenuModal(true);
  };

  const handleCloseMenuModal = () => {
    setOpenMenuModal(false);
  };

  const handleMediaSubTabChange = (value: number) => {
    setSelectedMediaSubTab(value);
  };

  const handleOpenEditModal = () => {
    group?.adminId === user?.user?.id && setOpenEditModal(true);
    handleCloseMenuModal();
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  useEffect(() => {
    !showTopicsMoreOptions && !showAddTopicDialog && setTopicData(initialTopicData);
  }, [showAddTopicDialog, showTopicsMoreOptions]);

  const handleCreateGroupPost = () => {
    if (group?.conversationId) {
      navigate(`/specter/create/post?GroupId=${group?.conversationId}`, { state: { props: { group } } });
      handleCreateContentClose();
    } else {
      console.error("No conversation ID available");
    };
  };

  const handleCreateGroupScroll = () => {
    if (group?.conversationId) {
      navigate(`/specter/create/scroll?GroupId=${group?.conversationId}`, { state: { props: { group } } });
      handleCreateContentClose();
    } else {
      console.error("No conversation ID available");
    }
  };

  const transformedGroupArticles = useMemo(() => {
    return selectedFilterAndSort.filter === "Scrolls"
      ? (discussionData?.pages || [])?.flatMap(page => (
        page.message_getDiscussions?.result?.items.length
          ? page?.message_getDiscussions?.result?.items?.map(d => {
            return {
              article: d.article,
              isLiked: d.isLiked,
              isNotInterested: d.isNotInterested,
              isSaved: d.isSaved,
              isYourArticle: d.isYours,
              isViewed: d.isViewed,
              createdDate: d.article?.createdDate ?? '',
              commentCount: d.commentCount,
              shareCount: d.shareCount,
              viewCount: d.viewCount,
              likeCount: d.likeCount,
              articleItemsString: d.article?.articleItemsString ?? ''
            } as ArticleItem;
          })
          : []
      ))
      : []
  }, [discussionData, selectedFilterAndSort.filter]);

  const { requestToJoin, loading: requestingtoJoin } = useRequestToJoinGroup();

  const isPlusButtonVisible = useMemo(() => (group?.adminId === user?.user?.id && (selectedTab === "1" || selectedTab === "2")) || (group?.isMemberOfGroup && selectedTab === '1') || (!group?.isMemberOfGroup && selectedTab === "2"), [group, selectedTab]);

  const handlePlusButtonClick = () => {
    if (group?.isMemberOfGroup && selectedTab === "1") {
      handleCreateContentOpen();
    } else if (group?.adminId === user?.user?.id && selectedTab === "2") {
      setShowAddMemberDialog(true);
    } else if (!group?.isMemberOfGroup && selectedTab === "2") {
      !requestingtoJoin && requestToJoin({ groupId: group?.conversationId });
    };
  };

  const { data: groupRequestsData,
    isLoading: loadingRequests,
    // isFetching: fetchingRequests,
    // hasNextPage: hasNextPageRequests,
    // fetchNextPage: fetchNextPageRequests,
    refetch: getRequests } = useGetGroupRequests(group?.conversationId);

  useEffect(() => {
    group?.adminId === user?.user?.id && showPendingRequest && getRequests();
  }, [group, showPendingRequest]);

  const { approveRequest, loading: approvingrequest } = useApproveRequest();

  const handleApproveRequest = (userId: number) => {
    if (userId) {
      !approvingrequest && approveRequest({ groupId: group?.conversationId, userId }, () => {
        setShowPendingRequest(false);
      });
    };
  };

  return (
    <Box className="h-screen overflow-y-auto relative">
      <Box className="p-4 z-[99] fixed bottom-6 left-4 flex gap-3 justify-center text-center items-center">
        {group?.adminId === user?.user?.id && selectedTab === '2' && (
          <IconButton
            className="h-10 w-10 p-0 rounded-full bg-[#5A8EBB] text-white flex justify-center items-center"
            onClick={() => setShowPendingRequest(true)}
          ><IconUsersPlus size={20} /></IconButton>)}
      </Box>
      <Box className="p-4 z-[99] fixed bottom-6 right-4 flex gap-3 justify-center text-center items-center">
        {isPlusButtonVisible && (
          <IconButton
            className="h-10 w-10 p-0 rounded-full bg-[#5A8EBB] text-white flex justify-center items-center"
            onClick={handlePlusButtonClick}
          >
            {group?.isMemberOfGroup
              ? <IconPlus size={20} />
              : <IconUserShare size={20} />}</IconButton>)}
      </Box>
      <Box className="relative bg-[#5A8EBB] dark:bg-blue-950/80 pb-20 pt-4">
        <div className="flex justify-between items-start w-full">
          <IconArrowLeft className='text-white m-3 z-50' onClick={() => navigate("/specter/groups")} />
          <div
            onClick={() => setIsTopicsDrawerOpen(true)}
            className='text-white m-3 z-50 font-semibold flex items-center gap-1'>Topics <IconArrowRight /></div>
        </div>
        <div className="relative bg-black/2 z-50 text-center w-full mx-auto">
          <div className="flex items-center justify-center gap-2">
            <Typography variant="h5" className="text-white font-bold">
              {group?.groupName}
            </Typography>
            {group?.isMemberOfGroup &&
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-blue-500">
                {<IconButton
                  size="small"
                  onClick={handleOpenMenuModal}
                >
                  <IconPencil size={15} strokeWidth={3} />
                </IconButton>}
              </div>}
          </div>
          <Typography variant="body2" className="text-white">
            {group?.groupMemberCount} member{group?.groupMemberCount > 1 && 's'}
          </Typography>
        </div>
        {group?.groupImgageUrl &&
          <LazyLoadImage
            src={group?.groupImgageUrl}
            alt="Group Cover"
            onError={handleOnErrorImage}
            className="w-full absolute top-0 left-0 -z-1 h-full object-cover"
          />}
      </Box>

      <TabContext value={selectedTab}>
        <Box className={`flex-grow overflow-y-auto overflow-x-hidden relative h-full ${selectedFilterAndSort.filter === "Posts" ? "!bg-[#090909] text-white" : ""}`}>
          <div className="border-gray-200">
            <TabList className="bg-transparent static" isStyle onChange={handleTabChange}>
              {tabsConfig.map((tab) => (
                <Tab
                  key={tab.id}
                  label={tab.id === "0"
                    ? <IconAdjustmentsHorizontal />
                    : tab.label}
                  value={tab.id}
                  className={`${tab.id === "0" ? 'pl-12 w-1/2' : tab.id === "3" ? "pr-12" : ""}`}
                  selectedColor="#5A8EBB"
                />
              ))}
            </TabList>
          </div>

          <TabPanel value="0">
            <div className="mt-5 px-5 pt-3">
              <div>
                {filterAndSortOptions.map((option) => (
                  <Box key={option.label} mb={3}>
                    <Typography variant="h6">{option.label}</Typography>
                    <RadioGroup
                      value={option.label === "Sort By"
                        ? selectedFilterAndSort.sort
                        : selectedFilterAndSort.filter}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (option.label === "Sort By") {
                          setSelectedFilterAndSort({ ...selectedFilterAndSort, sort: value as "Asc" | "Desc" });
                          setSelectedTab('1');
                        } else {
                          setSelectedFilterAndSort({ ...selectedFilterAndSort, filter: value as "Posts" | "Scrolls" });
                          setSelectedTab('1');
                        }
                      }}
                    >
                      {option.options.map((opt) => (
                        <FormControlLabel
                          key={opt.label}
                          control={<Radio />}
                          label={opt.label}
                          value={opt.value}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                ))}
              </div>
            </div>
          </TabPanel>
          <TabPanel value="1" keepMounted>
            <>
              {loadingDiscussions
                ? <div className="text-center text-white"><CircularProgress /></div>
                : selectedFilterAndSort.filter === "Posts"
                  ? discussionData?.pages.map(page => (
                    page.message_getDiscussions?.result?.items.length
                      ? page.message_getDiscussions?.result?.items?.map((discussion: DiscussionItem) =>
                      (<div key={discussion.id}>
                        <GroupPost
                          post={discussion}
                          onDelete={refetchDiscussions}
                          userId={user?.user?.id}
                        />
                      </div>))
                      : <NoDiscussion />))
                  : <Scrolls isCreatedInGroup groupArticles={transformedGroupArticles} />}

              <div ref={lastDiscussionRef}></div>
              {isFetching && !loadingDiscussions && <div className='text-center text-white'><CircularProgress /></div>}
            </>
          </TabPanel>
          <TabPanel value="2" keepMounted>
            <div className="mt-4">
              {group?.isMemberOfGroup
                ? loadingMembers || removingUser
                  ? <div className="text-center"><CircularProgress /></div>
                  : membersData === null
                    && errorInGroupMembers?.message_getGroupMembers?.status.code !== 1
                    ? <Typography variant="body1" className="text-center">{
                      errorInGroupMembers?.message_getGroupMembers?.status.value}
                    </Typography>
                    : membersData?.message_getGroupMembers?.result?.items?.length ? (
                      membersData?.message_getGroupMembers?.result?.items?.map(
                        (member: MemberItem) => (
                          <Box
                            key={member.user.id}
                            className='flex items-center justify-between mx-3'
                            mb={2}
                          >
                            <div className="flex gap-3 items-center">
                              <Avatar
                                aria-label="recipe"
                                style={{ width: "50px", height: "50px" }}
                                className={`border ${!member?.user?.imageAddress &&
                                  "bg-gray-200 text-black text-sm"}`}
                              >
                                {member?.user?.imageAddress ? (
                                  <LazyLoadImage src={member?.user?.imageAddress} />
                                ) : (
                                  <p>{member?.user?.displayName?.slice(0, 1)}</p>
                                )}
                              </Avatar>
                              <Box>
                                <Typography variant="body1">
                                  {member.user.displayName}
                                </Typography>
                                <Typography variant="body2">
                                  {member.user.username}
                                </Typography>
                              </Box>
                            </div>
                            {!member.isAdmin
                              ? removingUser
                                ? <div className="text-center"><CircularProgress /></div>
                                : (group?.adminId === user?.user?.id
                                  ? <div
                                    onClick={() => handleRemoveUser(member.user.id)}
                                    className="flex gap-1 text-red-500 items-center">
                                    <Typography>Remove</Typography>
                                    <IconUserMinus />
                                  </div> : null)
                              : <div className="flex gap-1 text-green-500 italic items-center">
                                <Typography>Admin</Typography>
                                <IconStar />
                              </div>}
                          </Box>
                        ))
                    ) : (
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        className="text-center italic"
                      >
                        No members yet.
                      </Typography>
                    )
                : <p className="italic text-center mt-32">You are not a member of the group. Click the below button to request to join!</p>}
            </div>
          </TabPanel>
          <TabPanel value="3">
            <div className="mt-10">
              <Box display="flex" justifyContent="space-around" mb={2}>
                <Button
                  variant={selectedMediaSubTab === 0 ? "contained" : "outlined"}
                  onClick={() => handleMediaSubTabChange(0)}
                  style={{
                    marginRight: "8px",
                    borderRadius: "16px",
                  }}
                >
                  Posts
                </Button>
                <Button
                  variant={
                    selectedMediaSubTab === 1 ? "contained" : "outlined"
                  }
                  onClick={() => handleMediaSubTabChange(1)}
                  style={{
                    borderRadius: "16px",
                  }}
                >
                  Videos
                </Button>
              </Box>

              {selectedMediaSubTab === 0 ? (
                <Box className="text-center">
                  <Typography variant="body1">Displaying posts...</Typography>
                </Box>
              ) : (
                <Box className="text-center">
                  <Typography variant="body1">
                    Displaying videos...
                  </Typography>
                </Box>
              )}
            </div>
          </TabPanel>
        </Box>
      </TabContext>

      {/* Create Content Modal */}
      {openCreateContentModal &&
        <Dialog
          open={openCreateContentModal}
          onClose={handleCreateContentClose}
        >
          <DialogContent>
            <SubmitBtn
              cta="Create Post"
              color="primary"
              varient="outlined"
              size="medium"
              hoverColor="white"
              needBorder
              classname="p-5 text-green-600 items-center hover:bg-white"
              handlclick={handleCreateGroupPost}
              style={{
                borderColor: "green",
                borderWidth: "2px",
                borderStyle: "solid",
                color: "green",
                width: "100%",
                marginBottom: "16px",
                borderRadius: "1rem",
                height: "49px",
              }}
            />

            <SubmitBtn
              cta="Create Scroll"
              color="primary"
              hoverColor="white"
              varient="outlined"
              needBorder
              size="medium"
              classname="p-5 text-red-600 items-center hover:bg-white"
              handlclick={handleCreateGroupScroll}
              style={{
                borderColor: "red",
                borderWidth: "2px",
                borderStyle: "solid",
                color: "red",
                width: "100%",
                borderRadius: "1rem",
                height: "49px",
              }}
            />
          </DialogContent>
        </Dialog>}

      {/* Menu Modal */}
      {openMenuModal &&
        <Dialog open={openMenuModal} onClose={handleCloseMenuModal} fullWidth>
          <DialogTitle className="text-center !bg-[#090909] text-white">Menu</DialogTitle>
          <DialogContent className="!bg-[#090909] text-white">
            <Box display="flex" flexDirection="column">
              {group?.adminId === user?.user?.id && <>
                <Button
                  variant="outlined"
                  startIcon={<IconPencil />}
                  style={{
                    marginBottom: "8px",
                    border: "none",
                    marginTop: "8px",
                    color: 'white'
                  }}
                  onClick={handleOpenEditModal}
                >
                  Edit Group
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<IconTrash className="text-red-500" />}
                  style={{
                    marginBottom: "8px",
                    border: "none",
                    marginTop: "8px",
                    color: 'rgb(239 68 68)'
                  }}
                  onClick={handleDelete}
                >
                  Delete Group
                </Button>
              </>}
              {group?.isMemberOfGroup &&
                <Button
                  variant="outlined"
                  startIcon={<IconLogout />}
                  style={{
                    marginBottom: "8px",
                    border: "none",
                    marginTop: "8px",
                    color: 'white'
                  }}
                  onClick={handleLeaveGroup}
                >
                  Leave Group
                </Button>}
            </Box>
          </DialogContent>
        </Dialog>}

      {/* Edit Group Modal */}
      {openEditModal &&
        <Dialog
          open={openEditModal}
          onClose={handleCloseEditModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <GroupForm
              onSubmit={handleUpdateGroup}
              onCancel={handleCloseEditModal}
              initialData={{
                groupName: group?.groupName,
                link: group?.groupLink,
                visibility: group?.isPrivate ? "Private" : "Public",
                coverImage: group?.groupImgageUrl,
              }}
              isEditing
              isUpdating={isUpdating}
            />
          </DialogContent>
        </Dialog>}

      {/* Add Member Dialog */}
      {showAddMemberDialog &&
        <Dialog
          open={showAddMemberDialog}
          onClose={() => { setShowAddMemberDialog(false); searchTerm && setSearchTerm(''); }}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent className="!bg-[#090909] text-white">
            <Typography variant="overline" className="text-center">
              Add a new Member to <strong className="italic">{group?.groupName}</strong>
            </Typography>

            <SearchBar cb={refetchUsers} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className='p-2'>
              {isFetchingUsers || addingMember
                ? <div className="text-center"><CircularProgress /></div>
                : nonGroupMembers?.pages?.flatMap(page => (
                  !page.user_getUsers.result.items.length
                    ? <>
                      <Lottie loop animationData={NoData} style={{ width: "200px", height: "200px", margin: "0 auto" }} />
                      <Typography className='text-md text-center italic'>
                        No User(s) found!
                      </Typography>
                    </>
                    : page.user_getUsers.result.items.map(u => (
                      <div key={u.id} className='flex justify-between my-3 items-center bg-gray-100 p-3 rounded-2xl'>
                        <div className='flex gap-3 items-center'>
                          <Avatar
                            aria-label="recipe"
                            className={`border ${!u?.imageAddress && "bg-gray-200 text-sm text-black"}`}
                          >
                            {u?.imageAddress
                              ? <LazyLoadImage src={u?.imageAddress} />
                              : <p className='uppercase'>{u?.displayName?.slice(0, 1)}</p>}
                          </Avatar>

                          <Typography variant='body1' className="text-black">
                            {u.displayName} <span className='italic'>({u.username})</span>
                          </Typography>
                        </div>

                        <IconPlus onClick={() => handleAddMember(Number(u.id))} className='cursor-pointer text-black' />
                      </div>
                    ))
                ))}
            </div>
          </DialogContent>
        </Dialog>}

      {/* Pending Requests List */}
      {showPendingRequest &&
        <Dialog
          open={showPendingRequest}
          onClose={() => setShowPendingRequest(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent className="!bg-[#090909] text-white">
            <Typography variant="overline" className="text-center">
              Pending Requests
            </Typography>

            <div className='py-3'>
              {loadingRequests
                ? <div className="text-center"><CircularProgress /></div>
                : groupRequestsData?.length
                  ? groupRequestsData?.map(req => (
                    <div key={req.id} className='flex justify-between my-3 items-center bg-gray-100 p-3 rounded-2xl'>
                      <div className='flex gap-3 items-center'>
                        <Avatar
                          aria-label="recipe"
                          className={`border ${!req?.user?.imageAddress && "bg-gray-200 text-black text-sm"}`}
                        >
                          {req?.user?.imageAddress
                            ? <LazyLoadImage src={req?.user?.imageAddress} />
                            : <p className='uppercase text-black'>{req?.user?.displayName?.slice(0, 1)}</p>}
                        </Avatar>

                        <Typography variant='body1' className="text-black">
                          {req?.user?.displayName} <span className='italic'>({req?.user?.username})</span>
                        </Typography>
                      </div>

                      <IconButton
                        className='cursor-pointer rounded-full bg-green-400 text-white'
                        onClick={() => handleApproveRequest(req?.user?.id)} >
                        <IconCheck />
                      </IconButton>
                    </div>
                  ))
                  : <p className="italic text-center">No Pending Requests yet!</p>}
            </div>
          </DialogContent>
        </Dialog>}

      {/* Add/Edit Topic Dialog */}
      {showAddTopicDialog &&
        <Dialog
          open={showAddTopicDialog}
          onClose={() => setShowAddTopicDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogContent className="!bg-[#090909] text-white">
            <Typography variant="overline" className="text-center">
              {topicData.action === 'Add'
                ? <>Add a new Topic to <strong className="italic">{group?.groupName}</strong></>
                : <>Edit Topic</>}
            </Typography>

            <div className="flex flex-col gap-2">
              <label htmlFor="groupTitle">Topic Title</label>

              <input
                id='groupTitle'
                type="text"
                value={topicData.title}
                className="border p-3 rounded-xl bg-black text-white"
                placeholder="Title"
                onChange={e => setTopicData({ ...topicData, title: e.target.value })} />

              {addingTopic || editingTopic
                ? <div className="text-center"><CircularProgress /></div>
                : <button
                  onClick={topicData.action === 'Add' ? handleAddTopic : handleEditTopic}
                  style={{ width: '50%', margin: "auto" }}
                  className="py-3 rounded-lg border border-gray-500 text-green-500"
                >
                  {topicData.action}
                </button>}
            </div>
          </DialogContent>
        </Dialog>}

      {/* More Options Dialog for Topics */}
      {showTopicsMoreOptions &&
        <Dialog open={showTopicsMoreOptions} onClose={() => setShowTopicsMoreOptions(false)}>
          <div className="flex flex-col gap-3 p-3 !bg-[#090909] text-white">
            <div className="flex gap-2" onClick={() => {
              setShowTopicsMoreOptions(false);
              setShowAddTopicDialog(true);
            }}>
              <IconEdit />
              <span>Edit Topic <span className="italic">({topicData.title})</span></span>
            </div>
            {removingTopic
              ? <div className="text-center"><CircularProgress /></div>
              : <div className="flex gap-2 text-red-900" onClick={handleRemoveTopic}>
                <IconTrash />
                <span>Remove Topic <span className="italic">({topicData.title})</span></span>
              </div>}
          </div>
        </Dialog>}

      {/* Topics Drawer */}
      {isTopicsDrawerOpen &&
        <Drawer anchor="right" open={isTopicsDrawerOpen} onClose={() => setIsTopicsDrawerOpen(false)}>
          <div className="py-3 px-2 !bg-[#090909] text-white h-screen">
            <div className="flex gap-3 mb-4 items-center justify-center min-w-[300px]">
              <Typography variant="h5" className="text-[16px]">Topics</Typography>
              {group?.adminId === user?.user?.id && <IconPlus size={20} onClick={() => setShowAddTopicDialog(true)} />}
            </div>
            {isFetchingTopics
              ? <div className="text-center"><CircularProgress /></div>
              : groupTopics?.pages?.map(page => (
                page.message_getGroupTopics.result.items.length
                  ? page.message_getGroupTopics.result.items.map(t => (
                    <div key={t.id} className="cursor-pointer flex items-center justify-between p-3 border-b border-gray-200 m-1">
                      <Typography className="flex text-[14px] items-center gap-2" variant="subtitle1" title={t.title} onClick={() => navigate(`/specter/groups/${group?.conversationId}/topics/${t.id}`, { state: { props: { topic: { ...t, ...{ groupId: group?.conversationId } } } } })}>
                        <IconUsersGroup size={17} /> {t.title}
                      </Typography>

                      <IconDotsVertical
                        onClick={() => {
                          setTopicData({ id: t.id, title: t.title, action: "Edit" })
                          setShowTopicsMoreOptions(true);
                        }}
                        className='cursor-pointer' />
                    </div>
                  ))
                  : <>
                    <Lottie loop animationData={NoData} style={{ width: "200px", height: "200px", margin: "0 auto" }} />
                    <Typography className='text-md text-center italic'>
                      No Topic(s) found!
                    </Typography>
                  </>
              ))}
          </div>
        </Drawer>}
    </Box>
  );
};

export default GroupDetails;

export const NoDiscussion = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Lottie
        loop={false}
        animationData={NoData}
        style={{
          width: "200px",
          height: "200px",
          margin: "0 auto",
        }}
      />
      <Typography
        variant="body1"
        color="textSecondary"
        className="text-center italic"
      >
        No discussions yet.
      </Typography>
    </div>
  );
};
