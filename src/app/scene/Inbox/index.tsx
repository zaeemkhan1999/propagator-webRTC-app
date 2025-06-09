import { lazy, useEffect, useMemo, useRef, useState } from "react";
import { IconButton, Skeleton, Typography } from "@mui/material";
import { IconArrowLeft, IconPlus, IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { useSnapshot } from "valtio";
import { userStore } from "../../../store/user";
import { useGetMessageUsers, UserMessage } from "./queries/getMesageUsers";
import { DaysAgo } from "../../utility/misc.helpers";
import Lottie from "lottie-react";
import NoData from "../../utility/Nodata.json";
import { Slice } from "../../../helper";
import StoriesPage from "@/components/Stories";
import { initializeWsClient, wsClient } from "@/http/graphql.client";
import { subscribeToMessages } from "./Subscriptions/getMessagesSubscriptions";
import UserAvatar from "@/components/Stories/components/UserAvatar";

const SearchBar = lazy(() => import("../Explore/Components/SearchBar"));

const Inbox = () => {
  const navigate = useNavigate();
  const user = useSnapshot(userStore.store).user;

  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);

  const { data,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch } = useGetMessageUsers({ userId: user?.id, searchTerm });

  useEffect(() => {
    refetch();
    initializeWsClient();
    if (!user?.id) return;

    const unsubscribe = subscribeToMessages(
      user.id,
      () => {
        refetch().then();
      },
      (error) => {
        wsClient?.terminate();
        console.error(error);
        initializeWsClient();
      },
    );
    return () => {
      wsClient?.terminate();
      unsubscribe();
    };
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isFetching) return;
    if (lastUserRef.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      observer.current.observe(lastUserRef.current);
    }

    return () => {
      if (observer.current && lastUserRef.current) {
        observer.current.unobserve(lastUserRef.current);
      }
    };
  }, [isFetching, fetchNextPage, hasNextPage]);

  const users = useMemo(
    () =>
      data?.pages.flatMap((page) => page.message_getUserMessages.result.items),
    [data],
  );

  const handleChatClick = (u: UserMessage) =>
    navigate(`/specter/inbox/chat/${u?.username}`, {
      state: {
        props: {
          otherUsername: u.username,
          otherUserId: u.userId,
          otherUserImage: u.imageAddress || "",
          otherUserLastSeen: u?.lastSeen || "",
          conversationId: u.conversationId,
          currentUserId: user?.id,
        },
      },
    });

  return (
    <div className="relative h-screen w-full bg-gray-100 dark:bg-gray-900">
      <div className="flex h-[60px] w-full items-start justify-between gap-3 bg-[#5A8EBB] px-2 py-2 dark:bg-blue-800/89">
        <button
          className="p-2"
          onClick={() => navigate("/specter/home")}
        >
          <IconArrowLeft color="white" />
        </button>
        <h1 className="text-xl font-semibold text-white capitalize">
          {user?.displayName}
        </h1>
        <button
          className="p-2 rounded-full bg-blue-300/50 dark:bg-blue-800/89 border-[1px] border-blue-400 dark:border-green-600/70"
          onClick={() => {
            setShowSearchBar(!showSearchBar);
            if (navigator) {
              navigator.vibrate(50);
            }
          }}
        >
          <IconSearch color="white" />
        </button>
      </div>

      <div className="flex items-center space-x-4 overflow-x-auto bg-[#5A8EBB] px-6 pb-4 dark:bg-blue-800/89">
        <StoriesPage />
      </div>

      {showSearchBar && (
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          cb={refetch}
          className="m-3 mb-1"
        />
      )}

      <div className="h-[73vh] space-y-4 overflow-y-auto px-4 pb-[30px] pt-4">
        {isLoading ? (
          <>
            {Array.from({ length: 6 }, (_, index) => index).map((_, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={60}
                  height={60}
                  className="bg-gray-300"
                />
                <div style={{ marginLeft: "10px", flex: 1 }}>
                  <Skeleton
                    animation="wave"
                    width="50%"
                    className="bg-gray-300"
                  />
                  <Skeleton
                    animation="wave"
                    width="70%"
                    className="bg-gray-300"
                  />
                </div>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width="40px"
                  className="bg-gray-300"
                />
              </div>
            ))}
          </>
        ) : !users?.length ? (
          <div>
            <Lottie
              loop={false}
              animationData={NoData}
              style={{ width: "200px", height: "200px", margin: "0 auto" }}
            />
            <Typography className="text-md text-center italic">
              No recent conversation(s) found, start a new conversation!
            </Typography>
          </div>
        ) : (
          (users || [])?.map((u: UserMessage, index: number) => {
            return (
              <div
                key={u?.conversationId}
                className="flex items-center gap-3 border-b border-gray-200 pb-2 dark:border-gray-800 text-black dark:text-white"
                ref={index === (users || [])?.length - 1 ? lastUserRef : null}
              >
                <div className="relative">
                  <UserAvatar
                    user={{
                      id: +u?.userId,
                      imageAddress: u?.imageAddress,
                      username: u?.username,
                    }}
                    isSelf={user?.id === +u?.userId}
                  />
                  <div className="rounded-full w-[12px] h-[12px] absolute bottom-1 right-1 bg-[#57B77D] z-50 border-[1px] border-white" />
                </div>

                <div className="flex items-center w-full justify-between" onClick={() => handleChatClick(u)}>
                  <div>
                    <h2 className="text-[16px] font-[500] capitalize">
                      {u?.displayName}
                    </h2>
                    <span className="text-[14px] font-normal text-gray-500 dark:text-gray-200">
                      {u?.lastMessage?.senderId === user?.id && "You: "}
                      {u?.lastMessage?.messageType === "TEXT"
                        ? Slice(u?.lastMessage?.text, 25)
                        : u?.lastMessage?.messageType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {DaysAgo(u?.latestMessageDate)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <IconButton
        className="absolute bottom-6 right-5 bg-[#5A8EBB] p-3 text-white shadow-lg dark:bg-blue-800/89"
        onClick={() => navigate("/specter/inbox/all-users")}
      >
        <IconPlus />
      </IconButton>
    </div>
  );
};

export default Inbox;
