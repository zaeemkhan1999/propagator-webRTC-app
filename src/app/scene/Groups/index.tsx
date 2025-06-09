import { lazy, useState, type FC, type SyntheticEvent } from "react";
import GroupTabs from "./components/GroupTabs";
import { useCreateConversationGroupMutation } from "./mutations/createGroup.mutation";
import { TabListProps } from "../../../components/Tabs";
import { CircularProgress } from "@mui/material";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router";
import IconArrowLeft from "@/assets/icons/IconArrowLeft";

const GroupForm = lazy(() => import("./components/GroupForm"));

const Groups: FC = () => {
  const user = useSnapshot(userStore.store).user;
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);

  const [selectedTab, setSelectedTab] = useState(searchParams.get("tab") === "private" ? "private" : "public");
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const { createConversationGroup, loading: creatingGroup } = useCreateConversationGroupMutation();

  const handleFormSubmit = async (data: any) => {
    try {
      const input = {
        groupName: data.groupName,
        isPrivate: data.visibility === "Private",
        isShare: data.visibility !== "Private",
        groupDescription: "",
        groupImgageUrl: data.coverImage,
        groupLink: data.visibility === "Private" ? data.groupName : data.link,
      };

      await createConversationGroup({ input, userIds: [user?.id!] }, () => {
        setIsFormVisible(false);
      });
    } catch (err) {
      enqueueSnackbar("Error creating group", { autoHideDuration: 3000, variant: "error" })
      console.error("Error creating group:", err);
    }
  };

  const handleTabChange: TabListProps["onChange"] = (event: SyntheticEvent, newValue: string) => setSelectedTab(newValue);

  const handleCreateGroupClick = () => {
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  return (
    <div className="w-full h-full overflow-y-auto pb-[400px]">
      {isFormVisible
        ? <GroupForm onSubmit={handleFormSubmit} onCancel={handleCancel} />
        : <>
          <div className="px-2 bg-[#5A8EBB] dark:bg-blue-950/80 pt-4 pb-7" >
            <div className="flex justify-between gap-2 items-center ">
              <button
                className="py-2 px-4"
                onClick={() => navigate("/specter/home")}
              >
                <IconArrowLeft color="white" />
              </button>

              <button
                className="p-2 bg-[#7cacd3]/40 border-[1px] rounded-full border-[#6a9fcc]"
                onClick={() => setShowSearchBar(!showSearchBar)}
              >
                <IconSearch color="white" />
              </button>
            </div>
            <div className="w-full flex justify-center my-2">
              {creatingGroup
                ? <div className="text-center"><CircularProgress /></div>
                : <button
                  onClick={handleCreateGroupClick}
                  className="font-bold text-[16px] text-white flex items-center justify-center gap-1 min-w-[120px] text-nowrap"
                >
                  <IconPlus size={20} className="text-white" /> Create Group
                </button>
              }
            </div>
          </div>

          <GroupTabs
            selectedTab={selectedTab}
            onChange={handleTabChange}
            showSearchBar={showSearchBar}
          />
        </>}
    </div>
  );
};

export default Groups;
