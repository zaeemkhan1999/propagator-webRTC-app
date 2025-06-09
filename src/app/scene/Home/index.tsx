import { lazy, useEffect, useMemo, useState } from "react";
import {
  Tab,
  TabContext,
  TabList,
  TabListProps,
  TabPanel,
} from "@/components/Tabs";
import { useNavigate } from "react-router";
import You from "./components/You";

const tabsConfig = [
  { id: 0, label: "Home" },
  { id: 1, label: "Scrolls" },
  { id: 2, label: "Long" },
  { id: 3, label: "Shop" },
  { id: 4, label: "Following" },
];

const Scrolls = lazy(() => import("./components/Scrolls"));
const Youtube = lazy(() => import("./components/Youtube"));
const FreeMarket = lazy(() => import("./components/FreeMarket"));

const Home = () => {
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);

  const getTabId = (tab: string): number => tabsConfig.find(t => t.label === tab)?.id || 0;
  const getTabLabel = (id: number): string => tabsConfig.find(t => t.id === id)?.label || "Home";

  const tab = useMemo(() => (searchParams.get('Tab') &&
    tabsConfig.some(t => t.label === searchParams.get('Tab')))
    ? getTabId(searchParams.get('Tab')!)
    : 0, [searchParams]);

  const [selectedTab, setSelectedTab] = useState(tab);

  useEffect(() => {
    selectedTab !== tab && setSelectedTab(tab);
  }, [tab]);

  useEffect(() => {
    if (![0].includes(selectedTab)) {
      document.body.classList.add("not-on-home");
    } else {
      document.body.classList.remove("not-on-home");
    }
    return () => {
      document.body.classList.remove("not-on-home");
    };
  }, [selectedTab]);

  const handleTabChange: TabListProps["onChange"] = (e: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    navigate(`/specter/home?Tab=${getTabLabel(newValue)}`);
  };

  return (
    <TabContext value={selectedTab}>
      <div className="flex-grow overflow-y-auto overflow-x-hidden relative h-full ">
        <div className="z-50 bg-gradient-to-b from-black/50 to-transparent border-gray-200">
          <TabList
            isStyle
            className="bg-transparent pt-1 home-tabs !justify-center "
            onChange={handleTabChange}
            justify="center"
            selectedColor={`${selectedTab !== 1 ? "white" : "#22c55e"}`}
            indicatorDisplay="block"
          >
            {tabsConfig.map((t) => (
              <Tab
                key={t.id}
                value={t.id}
                label={t.label}
                selectedColor={`${selectedTab !== 1 ? "white" : "#22c55e"}`}
                className={`${selectedTab !== 1 ? "text-gray-100" : "text-black"} w-fit cursor-pointertracking-wide !text-[13px] `}
              />
            ))}
          </TabList>
        </div>

        <TabPanel value={0}>
          <You needWatchHistory />
        </TabPanel>

        <TabPanel value={1}>
          <div className="pt-6">
            <Scrolls />
          </div>
        </TabPanel>

        <TabPanel value={2}>
          <Youtube needTopPadding />
        </TabPanel>

        <TabPanel value={3}>
          <FreeMarket needTopPadding />
        </TabPanel>

        <TabPanel value={4}>
          <You isFollowingsPostsPage needWatchHistory />
        </TabPanel>
      </div>
    </TabContext>
  );
};

export default Home;
