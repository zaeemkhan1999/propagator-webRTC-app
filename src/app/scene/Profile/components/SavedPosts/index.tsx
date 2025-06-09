import Header from "@/components/Header";
import { type SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    TabContext,
    TabList,
    Tab,
    TabPanel,
    TabListProps,
} from "@/components/Tabs";
import { userStore } from "@/store/user";
import { useSnapshot } from "valtio";
import useIsSuperAdminAndIsProfessionalAccount from "@/hooks/useIsSuperAdminAndIsProfessionalAccount";
import { PostItem } from "../../PostTypes";
import ProfilePosts from "../ProfilePosts";
import SearchBar from "@/app/scene/Explore/Components/SearchBar";

const tabItems = [
    { id: "Posts", label: "Posts" },
    { id: "LongVideos", label: "Long Videos" },
];

const SavedPosts = () => {
    const navigate = useNavigate();
    const user = useSnapshot(userStore.store)?.user;

    const [isSuperAdmin] = useIsSuperAdminAndIsProfessionalAccount();

    const searchParams = new URLSearchParams(window.location.search);
    const tab = (searchParams.get('Tab') && tabItems.some(t => t.id === searchParams.get('Tab')))
        ? searchParams.get('Tab')!
        : "Posts";

    const [search, setSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFullScrollPost, setSelectedFullScrollPost] = useState<any>(null);
    const [showPost, setShowPost] = useState(false);
    const [selectedTab, setSelectedTab] = useState<string>(tab);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<PostItem | null>(null);

    const handleTabChange: TabListProps["onChange"] = (
        event: SyntheticEvent,
        newValue: string,
    ) => {
        setSelectedTab(newValue);
        navigate(`/specter/profile/saved-posts?Tab=${newValue}`);
    };

    useEffect(() => {
        setSelectedTab(tab);
    }, [tab]);

    useEffect(() => {
        !searchParams.get('post') && setShowPost(false);
    }, [searchParams.toString()]);

    return (
        <div className="relative flex h-screen w-full bg-white">
            {showPost ? (
                <ProfilePosts
                    isSavedPosts
                    setShowPost={setShowPost}
                    isSuperAdmin={isSuperAdmin}
                    userData={user ?? undefined}
                    isBottomSheetOpen={isBottomSheetOpen}
                    setIsBottomSheetOpen={setIsBottomSheetOpen}
                />
            ) : (
                <div className="relative h-full w-full overflow-y-auto overflow-x-hidden">
                    <Header
                        handleBack={() => navigate('/specter/profile')}
                        text={"Saved Posts"}
                        showEndIcon
                        textColor="black"
                    />
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
                        {<div className=" z-[10] p-4 top-[20px] flex w-full items-center gap-2 bg-transparent px-2">
                            <TabList
                                className={`left-8 z-50 w-full pe-10 text-black`}
                                navbarTab
                                onChange={handleTabChange}
                            >
                                {tabItems.map((tab) => (
                                    <Tab key={tab.id} label={tab.label} value={tab.id} />
                                ))}
                            </TabList>
                        </div>}

                        <TabPanel value="Posts">
                            <ProfilePosts
                                showHeader={false}
                                isSavedPosts
                                setShowPost={setShowPost}
                                isSuperAdmin={isSuperAdmin}
                                userData={user ?? undefined}
                                isBottomSheetOpen={isBottomSheetOpen}
                                setIsBottomSheetOpen={setIsBottomSheetOpen}
                            />
                        </TabPanel>
                        <TabPanel value="LongVideos">
                            <ProfilePosts
                                showHeader={false}
                                isLongVideos
                                isSavedPosts
                                setShowPost={setShowPost}
                                isSuperAdmin={isSuperAdmin}
                                userData={user ?? undefined}
                                isBottomSheetOpen={isBottomSheetOpen}
                                setIsBottomSheetOpen={setIsBottomSheetOpen}
                            />
                        </TabPanel>
                    </TabContext>
                </div>
            )}
        </div>
    );
};

export default SavedPosts;
