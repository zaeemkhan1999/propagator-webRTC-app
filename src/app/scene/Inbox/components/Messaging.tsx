import {
  lazy,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  IconPhoto,
  IconMicrophone,
  IconPaperclip,
  IconTrash,
  IconVideo,
  IconLoader,
  IconArrowLeft,
  IconMenu3,
  IconSend2,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconCopy,
} from "@tabler/icons-react";
import SubmitBtn from "@/components/Buttons";
import useGetDirectMessages, { DirectMessage } from "../queries/getMessages";
import Lottie from "lottie-react";
import NoData from "../../../utility/Nodata.json";
import {
  MessageInput,
  MessageTypes,
  useAddDirectMessage,
} from "../mutations/addMessage";
import useUploadToAws from "@/hooks/useUploadToAws";
import { useDeleteConversation } from "../mutations/deleteChat";
import { useGetConversationWithOtherUser } from "../queries/getConversationId";
import { initializeWsClient, wsClient } from "@/http/graphql.client";
import { subscribeToMessages } from "../Subscriptions/getMessagesSubscriptions";
import { Navigate, useLocation, useNavigate } from "react-router";
import { ViewportBlock } from "./ViewportSensitiveDiv";
import "./messaging.css";
import { DaysAgo, generalDateFormat } from "@/app/utility/misc.helpers";
import Message from "./Message";
import ExportChatButton from "./exportChat";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import UserAvatar from "@/components/Stories/components/UserAvatar";
import { UserForStory } from "@/components/Stories";
import MessagesSkeleton from "./MessagesSkeleton";
import { enqueueSnackbar } from "notistack";
import useRemoveMessage from "../mutations/removeMessage";
import { handleOnErrorImage, Slice } from "@/helper";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { parsePostItems } from "@/components/Grid/utils";
import TypingIndicator from "./Typing";

const BottomSheet = lazy(() => import("@/components/BottomSheet/BottomSheet"));
const ShareUIDrawer = lazy(() => import("@/components/Feed/ShareUIDrawer"));
const StoryViewer = lazy(() => import("@/components/Stories/components/StoryViewer"));

export interface MessagingProps {
  otherUsername: string;
  otherUserId: number;
  otherUserImage: string;
  otherUserLastSeen: string;
  conversationId: number;
  currentUserId: number;
};

const Messaging = () => {
  const navigate = useNavigate();

  const { state } = useLocation();
  const props: MessagingProps = state?.props;

  useEffect(() => {
    if (!props || !state) navigate("/specter/inbox");
  }, []);

  const currentUser = useSnapshot(userStore.store).user;

  const msgAreaRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [groupedMessages, setGroupedMessages] = useState<{ date: string, messages: DirectMessage[] }[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [conversationId, setConversationId] = useState<number>(props?.conversationId);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [showIcons, setShowIcons] = useState<boolean>(false);
  const [showMsgOptions, setShowMsgOptions] = useState<DirectMessage | null>(null);
  const [msgOptionData, setMsgOptionData] = useState<{ type: "reply" | "forward" | "delete", data: DirectMessage } | null>(null);
  const [mediaFiles, setMediaFiles] = useState<{
    image: File | null;
    audio: File | null;
    video: File | null;
    file: File | null;
  }>({
    image: null,
    audio: null,
    video: null,
    file: null,
  });

  const [typing, setTyping] = useState(false)

  const { getConversationId, loading: loadingConversationId } = useGetConversationWithOtherUser();

  const doScroll = () => {
    setTimeout(() => {
      lastMsgRef.current?.scrollIntoView({
        block: "start",
        inline: "start",
        behavior: "instant"
      });
    }, 10);
  };

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    refetch: getMessages,
    hasNextPage,
  } = useGetDirectMessages({
    userId: props?.currentUserId,
    conversationId,
  });

  const [initialLoad, setInitialLoad] = useState(!data?.messages?.length || conversationId !== 0);

  useEffect(() => {
    conversationId === 0 && props?.otherUserId &&
      getConversationId({ otherUserId: props?.otherUserId }, (id) => {
        setConversationId(id ?? 0);
      });

    if (conversationId === 0) {
      if (initialLoad) {
        setTimeout(() => {
          setInitialLoad(false);
        }, 50);
      };
      return;
    };

    doScroll();

    getMessages()
      .then(() => {
        doScroll();

        if (initialLoad) {
          setTimeout(() => {
            setInitialLoad(false);
          }, 50);
          doScroll();
        };
      });

    initializeWsClient();
    const unsubscribe = subscribeToMessages(
      props?.currentUserId,
      (data) => {
        if (data.notificationReceived.message.senderId === props?.otherUserId) {
          getMessages().then(() => {
            doScroll();
          });
        }
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
  }, [conversationId]);

  useEffect(() => {
    setGroupedMessages(() => {
      const grouped: Record<string, DirectMessage[]> = {};
      const reversedGrouped: { date: string; messages: DirectMessage[] }[] = [];

      data?.messages?.forEach((message) => {
        const date = generalDateFormat(message?.createdDate);
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(message);
      });

      for (const date in grouped) {
        reversedGrouped.push({
          date,
          messages: grouped[date],
        });
      };

      return reversedGrouped;
    });
  }, [data?.messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.overflowY = 'auto';
      const newHeight = Math.min(inputRef.current.scrollHeight, window.innerHeight * 0.35);
      inputRef.current.style.height = `${newHeight}px`;
    }
  }, [newMessage]);

  const { addMessage, loading: addingMessage } = useAddDirectMessage();

  const appendPendingMessage = () => {
    setNewMessage("");
    msgOptionData && setMsgOptionData(null);

    if (navigator) {
      navigator.vibrate(50);
    };

    const date = generalDateFormat(new Date());

    setGroupedMessages(prev => {
      const msgObj = prev.find(m => m.date === date);
      const newMsg: any = {
        id: Date.now(),
        messageType: "TEXT",
        text: newMessage.trim(),
        createdDate: new Date(),
        conversationId,
        sender: {
          id: currentUser?.id,
          displayName: currentUser?.displayName,
          username: currentUser?.username,
          imageAddress: currentUser?.imageAddress
        },
        receiver: {
          id: props?.otherUserId,
          username: props?.otherUsername,
          displayName: props?.otherUsername,
          imageAddress: props?.otherUserImage
        },
        status: "PENDING",
        parentMessage: msgOptionData ? msgOptionData?.data : null,
        post: null,
        story: null,
      };

      if (!msgObj) {
        return [...prev, { date, messages: [newMsg] }];
      };

      return prev.map(msg =>
        msg.date !== date
          ? msg
          : { ...msg, messages: [...msg.messages, newMsg] }
      );
    });

    doScroll();
  };

  const markMessageAsSent = (id: number) => {
    const date = generalDateFormat(new Date());

    setGroupedMessages(prev => {
      const msgObj = prev.find(m => m.date === date);

      if (msgObj) {
        return prev.map(msg =>
          msg.date !== date
            ? msg
            : { ...msg, messages: msgObj.messages.map(m => (m?.status === "PENDING" ? { ...m, id, status: undefined } : m)) }
        );
      };

      return prev;
    });
  };

  const handleSendMessage = () => {
    if (props?.currentUserId && props?.otherUserId && newMessage.trim()) {
      appendPendingMessage();

      const input: MessageInput = {
        messageType: MessageTypes.TEXT,
        isShare: false,
        conversationId,
        parentMessageId: msgOptionData?.type === "reply" ? msgOptionData?.data?.id : null,
        text: newMessage.trim(),
        receiverId: props?.otherUserId,
      };

      addMessage({ input }, ({ id, conversationId: cId }) => {
        if (conversationId === 0) {
          setConversationId(cId);
        } else {
          markMessageAsSent(id);
        };
      });
    };

    inputRef.current?.focus();
  };

  const handleFileChange = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];

      setMediaFiles((prev) => {
        const newMediaFiles = { ...prev, [type]: file };
        Object.keys(newMediaFiles).forEach((key) => {
          if (key !== type)
            newMediaFiles[key as keyof typeof newMediaFiles] = null;
        });
        return newMediaFiles;
      });

      setShowIcons(false);
    };
  };

  useEffect(() => {
    handleSendMedia();
  }, [mediaFiles]);

  const { uploadToAws, isUploading } = useUploadToAws();

  const handleSendMedia = () => {
    if (
      props?.currentUserId &&
      props?.otherUserId &&
      (mediaFiles.image ||
        mediaFiles.audio ||
        mediaFiles.video ||
        mediaFiles.file)
    ) {
      const file =
        mediaFiles.image ||
        mediaFiles.audio ||
        mediaFiles.video ||
        mediaFiles.file;

      uploadToAws(file).then((url) => {
        const messageObject: MessageInput = {
          messageType: file?.type.includes("image")
            ? MessageTypes.PHOTO
            : file?.type.includes("audio")
              ? MessageTypes.VOICE
              : file?.type.includes("video")
                ? MessageTypes.VIDEO
                : MessageTypes.FILE,
          isShare: false,
          parentMessageId: msgOptionData?.type === "reply" ? msgOptionData?.data?.id : null,
          conversationId,
          text: file?.name || '',
          contentAddress: url,
          receiverId: props?.otherUserId,
        };

        setMediaFiles({ image: null, audio: null, video: null, file: null });
        msgOptionData && setMsgOptionData(null);

        addMessage({ input: messageObject }, ({ conversationId: cId }) => {
          if (conversationId === 0) {
            setConversationId(cId);
          } else {
            getMessages().then(() => {
              doScroll();
            });
          }
        });
      });
    }
  };

  const { deleteConversation, loading: deletingChat } = useDeleteConversation();

  const handleDeleteChat = () => {
    deleteConversation({ conversationId }, () => {
      setOpenDeleteDialog(false);
      navigate("/specter/inbox");
    });
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage().then((resp) => {
        setTimeout(() => {
          if (resp?.data?.lastMsgId) {
            const msgElem = document.getElementById(String(resp?.data?.lastMsgId));
            if (msgElem) {
              msgElem.scrollIntoView({ block: "start", behavior: "instant", inline: "start" });
            };
          };
        }, 50);
      });
    };
  };

  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const toggleIcons = () => !isUploading && setShowIcons((prev) => !prev);

  const [openStoryDialog, setOpenStoryDialog] = useState<any[] | null>(null);

  const [user, setUser] = useState<UserForStory>({
    id: currentUser?.id,
    username: currentUser?.username,
    displayName: currentUser?.displayName,
    imageAddress: currentUser?.imageAddress
  });

  const handleViewStory = (message: DirectMessage) => {
    const { story } = message || {};

    if (story) {
      const { user: u } = story;

      setUser({
        id: u?.id,
        username: u?.username,
        displayName: u?.displayName,
        imageAddress: u?.imageAddress,
      });
      setOpenStoryDialog([story]);
    };
  };

  const handleFileDownload = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = "_blank";
    a.click();
  };

  const handleMessageClick = (msg: DirectMessage) => {
    msgOptionData && setMsgOptionData(null);
    setShowMsgOptions(msg);
  };

  const handleReplyClick = () => {
    if (showMsgOptions) {
      setMsgOptionData({ type: "reply", data: showMsgOptions });
      setShowMsgOptions(null);
      inputRef?.current?.focus();
    };
  };

  const handleForwardClick = () => {
    if (showMsgOptions) {
      setMsgOptionData({ type: "forward", data: showMsgOptions });
      setShowMsgOptions(null);
    };
  };

  const handleCopyClick = () => {
    if (showMsgOptions && showMsgOptions?.messageType === MessageTypes.TEXT && navigator) {
      navigator.clipboard.writeText(showMsgOptions?.text).then(() => {
        enqueueSnackbar("Copied", { variant: "info", autoHideDuration: 3000, anchorOrigin: { horizontal: "left", vertical: "top" } });
      });
      setShowMsgOptions(null);
    };
  };

  const { removeMessage, loading: removingMessage } = useRemoveMessage();

  const handleDeleteClick = () => {
    if (showMsgOptions) {
      !removingMessage && removeMessage(showMsgOptions?.id, () => {
        const date = generalDateFormat(showMsgOptions?.createdDate);
        const msgObj = groupedMessages.find(m => m.date === date);

        if (msgObj) {
          setGroupedMessages(prev => {
            return prev.map(msg =>
              msg.date !== date
                ? msg
                : { ...msg, messages: msgObj.messages.filter(m => m?.id !== showMsgOptions?.id) }
            );
          });
        };
        setShowMsgOptions(null);
      });
    };
  };

  return (
    <div className="flex h-dvh flex-col bg-black dark:bg-gray-900">
      {/* Header */}
      <div className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between bg-black/70 p-3 text-black shadow-md dark:bg-gray-900 dark:text-white`}>
        <div className="flex items-center gap-2">
          <IconButton
            className="!p-0 cursor-pointer"
            onClick={() => navigate("/specter/inbox")}
          >
            <IconArrowLeft size={24} fontSize="small" color="white" />
          </IconButton>
          <div className="flex items-center space-x-2">
            <UserAvatar
              user={{
                id: props?.otherUserId,
                username: props?.otherUsername,
                imageAddress: props?.otherUserImage,
              }}
              isSelf={currentUser?.id === props?.otherUserId}
              size="10"
            />
            <div onClick={() => navigate(`/specter/userProfile/${props?.otherUserId}`)}>
              <h3 className="text-[16px] font-semibold capitalize text-white">
                {props?.otherUsername ?? <Navigate to={'/specter/inbox'} />}
              </h3>
              {props?.otherUserLastSeen &&
                <p className="text-gray-100 text-xs">Last seen <span className="font-semibold">{DaysAgo(props?.otherUserLastSeen)}</span></p>}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-1">
          <Tooltip title="Days remaining to delete the chat.">
            <div>
              <p className="text-white">{data?.messages?.length && data?.messages[0]?.daysRemainings}</p>
            </div>
          </Tooltip>
          <button
            className="flex items-center space-x-1 text-white dark:text-gray-300"
            onClick={() => setOpenOptions(true)}
          >
            <IconMenu3 size={24} fontSize="small" />
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div
        ref={msgAreaRef}
        className="chat-bg pt-[64px] flex flex-1 flex-col overflow-y-auto px-4 pb-[70px]"
        style={{
          overscrollBehaviorY: "contain"
        }}
      >
        {isFetching && !isLoading && !loadingConversationId && (
          <div className="flex justify-center absolute z-[999] left-1/2 top-1/2">
            <IconLoader className="animate-spin text-gray-100" size={35} />
          </div>
        )}

        {initialLoad
          ? <MessagesSkeleton />
          : hasNextPage
            ? <ViewportBlock onEnterViewport={handleLoadMore} />
            : null}

        {data?.messages?.length
          ? groupedMessages.map(({ date, messages: msgs }) => (<>
            <div key={date} className="space-y-4">
              <div className="my-2 text-center text-[12px] font-bold text-gray-100 dark:text-white">
                {date}
              </div>
              {msgs.map(m => (
                <Message
                  key={m?.id}
                  message={m}
                  props={props}
                  navigate={navigate}
                  handleViewStory={handleViewStory}
                  handleFileDownload={handleFileDownload}
                  onMessageClick={handleMessageClick}
                />
              ))}
            </div>

            <div className="invisible min-h-2" ref={lastMsgRef}></div>

          </>))
          : !isFetching && (
            <div className="mt-28 flex flex-col">
              <Typography className="text-center text-white italic">
                No messages yet. Start by sending a new message.
              </Typography>
              <Lottie
                loop
                animationData={NoData}
                className="mx-auto my-0 size-52"
              />
            </div>)}
        {typing && <TypingIndicator />}
      </div>

      {/* Input Area */}
      <div className="z-50 fixed bottom-0 left-0 right-0 bg-transparent dark:bg-gray-700">

        {/* Reply Preview */}
        {msgOptionData?.type === 'reply' &&
          <MessageReplyPreview
            msgOptionData={msgOptionData}
            setMsgOptionData={setMsgOptionData}
            currentUserId={currentUser?.id!}
          />}

        <div className="relative flex items-center px-2 py-2 shadow bg-[#1f1f1f]">
          <div className="relative self-end bottom-1 mr-2">
            <UserAvatar
              user={{
                id: props?.otherUserId,
                username: props?.otherUsername,
                imageAddress: props?.otherUserImage,
              }}
              isSelf={currentUser?.id === props?.otherUserId}
              size="8"
            />
            {true && <span className="absolute bottom-1 right-0 w-2 h-2 rounded-full bg-green-500 border-gray-100"></span>}
          </div>

          <textarea
            ref={inputRef}
            placeholder={`${props?.otherUsername} is online`}
            className="flex-1 text-white bg-inherit outline-none resize-none placeholder:italic"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={1}
          />

          <div
            className={`absolute bottom-14 bg-[#2f2f2f] z-20 ${newMessage.length ? 'right-[2.4rem]' : 'right-[0.5rem]'} flex flex-col items-center rounded-t-xl text-center backdrop-blur-sm transition-all duration-200 ${showIcons ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0"}`}
          >
            {["file", "image", "video", "audio"].map((type) => (
              <div className="ml-0" key={type}>
                <input
                  type="file"
                  className="hidden"
                  accept={type === "file" ? "*/*" : `${type}/*`}
                  id={`${type}Input`}
                  onChangeCapture={handleFileChange(type)}
                />
                <IconButton
                  onClick={() =>
                    document.getElementById(`${type}Input`)?.click()
                  }
                >
                  {type === "file" && (
                    <IconPaperclip className="text-white dark:text-white" />
                  )}
                  {type === "image" && (
                    <IconPhoto className="text-white dark:text-white" />
                  )}
                  {type === "video" && (
                    <IconVideo className="text-white dark:text-white" />
                  )}
                  {type === "audio" && (
                    <IconMicrophone className="text-white dark:text-white" />
                  )}
                </IconButton>
              </div>
            ))}
          </div>

          <IconButton
            onClick={toggleIcons}
            className="self-end relative z-20 h-10 w-10 text-gray-500 dark:text-gray-400"
          >
            {isUploading
              ? <CircularProgress size={20} className="text-gray-500" />
              : <IconPaperclip strokeWidth={1.5} />}
          </IconButton>

          {!!newMessage.length &&
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="self-end text-[#5A8EBB]  p-0 bottom-2 z-10"
              disabled={addingMessage}
            >
              <IconSend2 size={25} strokeWidth={1.5} />
            </IconButton>}
        </div>
      </div>

      {/* Message Options */}
      {!!showMsgOptions &&
        <BottomSheet
          isOpen={!!showMsgOptions}
          onClose={() => setShowMsgOptions(null)}
          bottom="fixed"
        >
          <div className="flex items-center flex-wrap gap-5 justify-center pb-8">
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={handleReplyClick}
            >
              <IconArrowBackUp />
              <p>Reply</p>
            </div>
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={handleForwardClick}
            >
              <IconArrowForwardUp />
              <p>Forward</p>
            </div>
            {showMsgOptions?.messageType === MessageTypes.TEXT &&
              <div
                className="cursor-pointer flex items-center gap-2"
                onClick={handleCopyClick}
              >
                <IconCopy />
                <p>Copy</p>
              </div>}
            {showMsgOptions?.sender?.id === currentUser?.id &&
              <div
                className="cursor-pointer flex items-center gap-2 text-red-500"
                onClick={handleDeleteClick}
              >
                <IconTrash />
                <p>Delete</p>
              </div>}
          </div>
        </BottomSheet>}

      {/* Forward Message Drawer */}
      {msgOptionData?.type === "forward" &&
        <ShareUIDrawer
          showShare={!!msgOptionData}
          setShowShare={state => !state && setMsgOptionData(null)}
          entityType={msgOptionData?.data?.messageType as MessageTypes}
          entityId={msgOptionData?.data?.messageType === MessageTypes.POST
            ? msgOptionData?.data?.post?.id
            : msgOptionData?.data?.messageType === MessageTypes.STORY
              ? msgOptionData?.data?.story?.id
              : msgOptionData?.data?.id}
          text={msgOptionData?.data?.messageType === MessageTypes.TEXT ? msgOptionData?.data?.text : ""}
          contentAddress={msgOptionData?.data?.contentAddress || ''}
          buttonName="Forward"
          successText="Forwarded"
        />}

      {/* Menu Dialog */}
      {openOptions &&
        <Dialog
          open={openOptions}
          onClose={() => setOpenOptions(false)}
          classes={{
            paper: "w-[700px] h-[650px]p-5 text-center rounded-lg",
          }}
        >
          <DialogTitle className=" text-lg font-bold text-gray-800">
            Options
          </DialogTitle>
          <DialogContent>
            <div className="space-y-4 text-center">
              <button
                className="flex items-center gap-4 text-red-500 dark:text-gray-300"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <IconTrash size={24} fontSize="small" /> Delete Chat
              </button>
              <ExportChatButton
                conversationId={conversationId}
                currentUserId={props?.currentUserId}
              />
            </div>
          </DialogContent>
          <DialogActions className="mt-6 flex flex-col justify-center">
            <button
              onClick={() => setOpenOptions(false)}
              className="text-gray-700 dark:text-gray-300"
            >
              Close
            </button>
          </DialogActions>
        </Dialog>}

      {/* Delete Confirmation Dialog */}
      {openDeleteDialog &&
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          classes={{
            paper: "w-[700px] h-[650px]p-5 text-center rounded-lg py-12",
          }}
        >
          <DialogTitle className="mt-12 text-lg font-bold text-gray-800">
            Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="mt-4 text-black">
              Are you sure you want to delete chat?
            </DialogContentText>
          </DialogContent>
          <DialogActions className="mt-6 flex flex-col justify-center">
            <div className="flex w-[85%] flex-col items-center gap-3">
              {deletingChat ? (
                <div className="text-center">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <SubmitBtn
                    cta="Delete"
                    varient="contained"
                    color="error"
                    size="small"
                    fullWidth
                    handlclick={handleDeleteChat}
                    classname="font-medium transition-colors py-2 px-0 rounded-2xl text-white border-none outline-none  h-[70px] bg-[rgb(158,28,28)]"
                  />
                  <SubmitBtn
                    cta="Cancel"
                    color="primary"
                    varient="outlined"
                    needBorder
                    size="small"
                    fullWidth
                    classname="p-5 rounded-2xl h-[70px] py-2 px-0"
                    handlclick={handleCloseDeleteDialog}
                    hoverColor="white"
                  />
                </>
              )}
            </div>
          </DialogActions>
        </Dialog>}

      {/* Story Viewer */}
      {!!openStoryDialog && (
        <StoryViewer
          isOpen={!!openStoryDialog}
          onClose={() => setOpenStoryDialog(null)}
          stories={openStoryDialog}
          setStories={setOpenStoryDialog}
          isMyStories={currentUser?.id === user?.id}
          user={user}
        />)}
    </div>
  );
};

export default Messaging;

interface MessageReplyPreviewProps {
  msgOptionData: { type: "reply" | "forward" | "delete", data: DirectMessage } | null;
  currentUserId: number;
  setMsgOptionData: Function;
};

const MessageReplyPreview = memo(({ msgOptionData, currentUserId, setMsgOptionData }: MessageReplyPreviewProps) => {
  return msgOptionData?.data
    ? <div className="absolute left-0 bottom-14 right-0 z-10 bg-gray-100 flex items-center justify-between px-3 py-1">
      <div className="flex gap-3 items-center">
        <IconArrowBackUp className="text-[#5A8EBB]" />
        <div>
          <h6 className="text-[#5A8EBB] font-semibold">{msgOptionData?.data?.sender?.id !== currentUserId ? msgOptionData?.data?.sender?.username : "You"}</h6>
          <div>{msgOptionData?.data?.messageType === MessageTypes.TEXT
            ? Slice(msgOptionData?.data?.text, 40)
            : msgOptionData?.data?.messageType === MessageTypes.PHOTO
              ? <LazyLoadImage
                src={msgOptionData?.data?.contentAddress}
                alt="Media"
                onError={handleOnErrorImage}
                className="rounded-lg w-10 h-10 object-cover"
              />
              : msgOptionData?.data?.messageType === MessageTypes.VIDEO
                ? <video muted autoPlay={false} className="rounded-lg h-10 w-10 object-cover">
                  <source src={msgOptionData?.data?.contentAddress} />
                  Your browser does not support the video element.
                </video>
                : msgOptionData?.data?.messageType === MessageTypes.POST
                  ? <LazyLoadImage
                    src={parsePostItems(msgOptionData?.data?.post?.postItemsString)[0]?.ThumNail || ""}
                    onError={handleOnErrorImage}
                    alt={"Post by " + msgOptionData?.data?.post?.poster?.username}
                    className="rounded-lg w-10 h-10 object-cover"
                  />
                  : msgOptionData?.data?.messageType === MessageTypes.STORY
                    ? <LazyLoadImage
                      src={msgOptionData?.data?.story?.contentAddress || ""}
                      onError={handleOnErrorImage}
                      alt={"Story by " + msgOptionData?.data?.story?.user?.username}
                      className="rounded-lg w-10 h-10 object-cover"
                    />
                    : msgOptionData?.data?.messageType}
          </div>
        </div>
      </div>

      <span
        className="rounded-full bg-[#5A8EBB] w-5 h-5 flex items-center justify-center text-white"
        onClick={() => setMsgOptionData(null)}
      >&times;</span>
    </div>
    : null
});
