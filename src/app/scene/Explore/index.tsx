import { type SyntheticEvent, useEffect, useState, lazy } from "react";
import SearchBar from "./Components/SearchBar";
import ThumbnailGrid from "@/components/Grid";
import { usePost_GetExplorePostsQuery } from "./queries/getExplorePosts";
import { useNavigate } from "react-router";
import { Texts } from "./Components/Texts";
import { Places } from "./Components/Places";
import { Tags } from "./Components/Tags";
import CustomGrid from "@/components/Grid/CustomGrid";
import {
  TabContext,
  TabList,
  Tab,
  TabPanel,
  TabListProps,
} from "@/components/Tabs";
import { IconSquareRoundedArrowLeft } from "@tabler/icons-react";
import { useGetExploreVideoPosts } from "./queries/getExploreVideos";
import { useGetExploreImagePosts } from "./queries/getExploreImages";
import { PER_PAGE_COUNT } from "../Home/queries/getPostsInAdvanceWay";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";

const Scrolls = lazy(() => import("../Home/components/Scrolls"));
const Groups = lazy(() => import("./Components/Groups"));
const Accounts = lazy(() => import("./Components/Accounts"));
const Links = lazy(() => import("./Components/Links"));

const tabItems = [
  { id: "Posts", label: "Posts" },
  { id: "Videos", label: "Videos" },
  { id: "Photos", label: "Photos" },
  { id: "Texts", label: "Texts" },
  { id: "Scrolls", label: "Scrolls" },
  { id: "Places", label: "Places" },
  { id: "Tags", label: "Tags" },
  { id: "Accounts", label: "Accounts" },
  { id: "Groups", label: "Groups" },
  { id: "Links", label: "Links" },
];

const Explore = () => {
  const user = useSnapshot(userStore.store).user;

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);

  const tab = (searchParams.get('Tab') && tabItems.some(t => t.id === searchParams.get('Tab')))
    ? searchParams.get('Tab')!
    : "Posts";

  const [selectedFullScrollPost, setSelectedFullScrollPost] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>(tab);

  const handleTabChange: TabListProps["onChange"] = (
    event: SyntheticEvent,
    newValue: string,
  ) => {
    setSelectedTab(() => {
      setSearchTerm("");
      return newValue;
    });
    navigate(`/specter/explore?Tab=${newValue}`);
  };

  useEffect(() => {
    setSelectedTab(tab);
  }, [tab]);

  const {
    data: explorePostsData,
    isFetching: isFetchingPosts,
    fetchNextPage: fetchNextPagePosts,
    refetch: refetchPosts,
    hasNextPage,
  } = usePost_GetExplorePostsQuery({
    take: 20,
    searchTerm: selectedTab === "Posts" ? debouncedSearchTerm : "",
  });

  const {
    data: exploreVideoPostsData,
    isFetching: isFetchingVideoPosts,
    fetchNextPage: fetchNextVideoPagePosts,
    refetch: refetchVideos,
  } = useGetExploreVideoPosts({
    take: 20,
    searchTerm: selectedTab === "Videos" ? debouncedSearchTerm : "",
  });

  const {
    data: exploreImagePostsData,
    isFetching: isFetchingImagePosts,
    fetchNextPage: fetchNextImagePagePosts,
    refetch: refetchImages,
  } = useGetExploreImagePosts({
    take: 20,
    searchTerm: selectedTab === "Photos" ? debouncedSearchTerm : "",
  });

  useEffect(() => {
    refetchPosts();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 750);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (
      (selectedTab === "Posts" ||
        selectedTab === "Photos" ||
        selectedTab === "Videos") && debouncedSearchTerm
    ) {
      selectedTab === "Posts"
        ? refetchPosts()
        : selectedTab === "Videos"
          ? refetchVideos()
          : selectedTab === "Photos"
            ? refetchImages()
            : null;
    }
  }, [debouncedSearchTerm, selectedTab]);

  const handleGoBack = () => {
    navigate("/specter/home");
  };

  const handleNavigateToFullPost = (id: number, index: number) => {
    const page = Math.max(1, Math.ceil((index + 1) / PER_PAGE_COUNT));
    navigate(`/specter/home?post=${id}&page=${page}`, { viewTransition: true });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflowY: "auto",
      }}
    >
      <TabContext value={selectedTab}>
        {!selectedFullScrollPost && (
          <div
            className={`h-[52px] overflow-hidden px-4 transition-all duration-500 ease-in-out`}
          >
            <div className="flex items-center gap-2 bg-transparent">
              <IconSquareRoundedArrowLeft onClick={handleGoBack} size={25} />
              <SearchBar
                className="m-auto my-2 h-10 w-full text-[14px] md:my-4 md:h-14 md:w-[75%]"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                cb={() => { }}
              />
            </div>
          </div>
        )}

        {!selectedFullScrollPost && (
          <div className={`${!selectedFullScrollPost ? "" : "absolute"} z-50 flex w-full items-center gap-2 bg-[#f9f9f9]`}>
            <TabList
              className="!text-dark static my-1 z-50 w-full !max-h-[25px] ps-2 pe-0"
              navbarTab
              onChange={handleTabChange}
            >
              {tabItems.map((tab) => (
                <Tab
                  className="text-dark !text-[13px]"
                  label={tab.label}
                  value={tab.id}
                  key={tab.id}
                />
              ))}
            </TabList>
          </div>
        )}

        <TabPanel value="Posts" keepMounted>
          <div>
            <CustomGrid
              postData={explorePostsData ?? []}
              isFetching={isFetchingPosts}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPagePosts}
              onClick={handleNavigateToFullPost}
            />
          </div>
        </TabPanel>
        <TabPanel value="Videos" keepMounted>
          <div>
            <ThumbnailGrid
              postData={exploreVideoPostsData ?? []}
              isFetching={isFetchingVideoPosts}
              fetchNextPage={fetchNextVideoPagePosts}
              mediaType={"video"}
              onClick={handleNavigateToFullPost}
            />
          </div>
        </TabPanel>
        <TabPanel value="Photos" keepMounted>
          <div>
            <ThumbnailGrid
              postData={exploreImagePostsData ?? []}
              isFetching={isFetchingImagePosts}
              fetchNextPage={fetchNextImagePagePosts}
              mediaType={"photos"}
              onClick={handleNavigateToFullPost}
            />
          </div>
        </TabPanel>
        <TabPanel value="Texts">
          <Texts searchTerm={searchTerm} userId={user?.id!} />
        </TabPanel>
        <TabPanel value="Scrolls">
          <Scrolls setSelectedFullScrollPost={setSelectedFullScrollPost} searchTerm={searchTerm} />
        </TabPanel>
        <TabPanel value="Places">
          <Places selectedTab={selectedTab} searchTerm={searchTerm} />
        </TabPanel>
        <TabPanel value="Tags">
          <Tags selectedTab={selectedTab} searchTerm={searchTerm} />
        </TabPanel>
        <TabPanel value="Accounts">
          <Accounts searchTerm={searchTerm} userId={user?.id!} />
        </TabPanel>
        <TabPanel value="Groups">
          <Groups searchTerm={searchTerm} />
        </TabPanel>
        <TabPanel value="Links">
          <Links selectedTab={selectedTab} searchTerm={searchTerm} />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default Explore;
