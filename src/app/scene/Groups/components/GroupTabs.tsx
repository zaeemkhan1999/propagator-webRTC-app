import {
  useRef,
  useEffect,
  memo,
  useState,
} from "react";
import { useGetGroups, GroupItem } from "../queries/getGroup.query";
import { Box, CircularProgress } from "@mui/material";
import GroupCard from "./GroupCard";
import {
  TabContext,
  TabList,
  Tab,
  TabListProps,
} from "@/components/Tabs";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import { useNavigate } from "react-router";
import Searchfields from "./SearchField";
import Modal from "@/components/Modals/Modal";
import { useRequestToJoinGroup } from "../mutations/requestToJoin";

interface GroupTabsProps {
  selectedTab: string;
  onChange: TabListProps["onChange"];
  showSearchBar: boolean;
};

const tabs = [
  {
    id: "public",
    label: "Public",
  },
  {
    id: "private",
    label: "Private",
  },
];

const GroupTabs: React.FC<GroupTabsProps> = memo(({ selectedTab, onChange, showSearchBar }) => {
  const user = useSnapshot(userStore.store)?.user;
  const navigate = useNavigate();
  const lastGroupRef = useRef<HTMLDivElement | null>(null);

  const [showRequestModal, setShowRequestModal] = useState<GroupItem | null>(null);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetching, refetch } =
    useGetGroups({
      userId: user?.id,
      skip: 0,
      take: 10,
      where: {
        isPrivate: { eq: selectedTab === "private" },
      },
    });

  useEffect(() => {
    refetch();
  }, [selectedTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (lastGroupRef.current) {
      observer.observe(lastGroupRef.current);
    }

    return () => {
      if (lastGroupRef.current) {
        observer.unobserve(lastGroupRef.current);
      }
    };
  }, [hasNextPage, isFetching, fetchNextPage]);

  const handleCardClick = (g: GroupItem) => {
    if (!g?.isPrivate || (g.isPrivate && g?.isMemberOfGroup)) {
      navigate(`/specter/groups/${g?.conversationId}`, { state: { props: { group: g } } });
    } else if (g?.isPrivate && !g?.isMemberOfGroup) {
      setShowRequestModal(g);
    };
  };

  const { requestToJoin, loading: requesting } = useRequestToJoinGroup();

  const handleRequestToJoin = () => {
    !requesting && showRequestModal &&
      requestToJoin({ groupId: showRequestModal?.conversationId }, () => {
        setShowRequestModal(null);
      });
  };

  return (<>
    <div className="h-full w-full">
      <TabContext value={selectedTab}>
        <TabList
          isStyle
          onChange={onChange}
          className="bg-[#5A8EBB] dark:bg-blue-950/80 !static pb-2"
          TabIndicatorProps={{ style: { marginBottom: 10 } }}
        >
          {tabs.map((tab) => (
            <Tab selectedColor="white" className="text-gray-200" key={tab.id} label={tab.label} value={tab.id} />
          ))}
        </TabList>
      </TabContext>
      <Box className="h-screen dark:bg-[#0f0f0f] overflow-y-auto pb-20 w-full">
        {showSearchBar && <Searchfields className="h-12 w-[92%] my-4 mx-4" />}
        {isLoading
          ? <div className="flex items-center justify-center h-full w-full"><CircularProgress /></div>
          : error
            ? (<p>Error Loading Groups!</p>)
            : data?.pages?.map(page => (
              page?.message_getGroups?.result?.items?.length
                ? page.message_getGroups.result.items.map(g =>
                  <GroupCard
                    key={g?.conversationId}
                    group={g}
                    onClick={() => handleCardClick(g)}
                  />
                )
                : (<p className="text-center italic pt-[40px]">No Group(s) Available!</p>)
            ))}

        <div ref={lastGroupRef}></div>
        {isFetching && !isLoading && <div className='text-center'><CircularProgress /></div>}
      </Box>
    </div>

    {!!showRequestModal &&
      <Modal
        isOpen={!!showRequestModal}
        onClose={() => setShowRequestModal(null)}
        title="Request to Join"
      >
        <div className="text-center">
          <h5>You are not the member of <span className="font-semibold capitalize italic">{showRequestModal?.groupName}</span>. You can request to access this group.</h5>

          <button
            onClick={handleRequestToJoin}
            className="text-green-300 px-3 py-2 rounded-lg border border-green-500 mt-3">{requesting
              ? <CircularProgress size={20} className="text-white" />
              : 'Request'}</button>
        </div>
      </Modal>}
  </>);
});

export default GroupTabs;
