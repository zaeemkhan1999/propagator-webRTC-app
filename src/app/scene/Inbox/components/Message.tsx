import { memo } from "react";
import { parsePostItems } from "@/components/Grid/utils";
import { handleOnErrorImage, Slice } from "@/helper";
import { Avatar, IconButton } from "@mui/material";
import { IconCheck, IconClock, IconDownload } from "@tabler/icons-react";
import { type NavigateFunction } from "react-router";
import { DirectMessage } from "../queries/getMessages";
import { MessagingProps } from "./Messaging";
import { generalTimeFormat } from "@/app/utility/misc.helpers";
import { MessageTypes } from "../mutations/addMessage";
import { useLongPress } from "@uidotdev/usehooks";

interface Props {
    message: DirectMessage;
    props: MessagingProps;
    navigate: NavigateFunction;
    handleViewStory: (message: DirectMessage) => void;
    handleFileDownload: (url: string) => void;
    onMessageClick: (msg: DirectMessage) => void;
};

const Message = memo(({ message, props, navigate, handleViewStory, handleFileDownload, onMessageClick }: Props) => {

    const longPress = useLongPress(() => onMessageClick(message), {});

    return (
        <div id={String(message?.id)} className={`flex ${message?.sender?.id === props?.otherUserId ? "justify-start text-start" : "justify-end text-end"}`}>
            <div
                className={`relative max-w-xs break-all !rounded-[18px] ${["POST", "STORY", "VIDEO", "PHOTO"].includes(message.messageType) ? "p-0" : "px-2 py-1"} ${message.sender.id === props?.otherUserId ? "rounded-bl-none bg-gray-200 text-black dark:bg-blue-500 dark:text-white" : "text-dark rounded-br-none bg-lime-100 text-left dark:bg-gray-700 dark:text-white"} ${message.messageType === "STORY" ? "mt-4" : ""}`}
                style={{ userSelect: "none" }}
                {...longPress}
            >
                {message.messageType === "TEXT" ?
                    message.sender.id === props?.otherUserId
                        ? <div className={`absolute -z-1 -bottom-1 left-[-8px] h-0 w-0 rotate-[50deg] border-l-[8px] border-r-[10px] border-t-[15px] border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-blue-500`} />
                        : <div className={`absolute -z-1 -bottom-1 right-[-8px] h-0 w-0 rotate-[-50deg] border-l-[10px] border-r-[8px] border-t-[15px] border-l-transparent border-r-transparent border-t-lime-100  dark:border-t-gray-700`} />
                    : null}

                {!message.messageType ||
                    message.messageType === "TEXT" ? (<>
                        {!!message?.parentMessage && <MessageReplyPreview m={message?.parentMessage} props={props} />}
                        <p className="text-[14px]">{message.text}</p>
                    </>) : (
                    <div>
                        {message.messageType === MessageTypes.PHOTO ? (
                            <img
                                src={message.contentAddress}
                                alt="Message Media"
                                className="w-full !rounded-[18px] h-60 cursor-pointer"
                                onClick={() => window.open(message.contentAddress)}
                            />
                        ) : message.messageType === MessageTypes.VOICE ? (
                            <audio controls className="w-full">
                                <source src={message.contentAddress} />
                                Your browser does not support the audio element.
                            </audio>
                        ) : message.messageType === MessageTypes.VIDEO ? (
                            <video controls className="w-full !rounded-[18px] h-60">
                                <source src={message.contentAddress} />
                                Your browser does not support the video element.
                            </video>
                        ) : message.messageType === MessageTypes.POST ? (
                            <div
                                className="cursor-pointer w-[200px] !rounded-[18px]"
                                onClick={() => navigate(`/specter/view/post/${message?.post?.id}`)}
                            >
                                <div className="mb-3 flex absolute top-2 left-2 items-center gap-2">
                                    <Avatar
                                        aria-label="recipe"
                                        className={`h-5 w-5 border ${!message?.post?.poster?.imageAddress && "bg-gray-200 text-sm text-white"}`}
                                    >
                                        {message?.post?.poster?.imageAddress ? (
                                            <img
                                                src={message?.post?.poster?.imageAddress}
                                            />
                                        ) : (
                                            <p className='uppercase'>
                                                {message?.post?.poster?.username?.slice(0, 1)}
                                            </p>
                                        )}
                                    </Avatar>
                                    <p className="text-xs font-medium text-white">
                                        {message?.post?.poster?.username || ""}
                                    </p>
                                </div>

                                <div className={`h-[20rem] min-w-[70%] !rounded-[18px] w-full overflow-hidden flex items-center justify-center`}>
                                    <img
                                        src={parsePostItems(message?.post?.postItemsString)[0]?.ThumNail || ""}
                                        onError={handleOnErrorImage}
                                        alt={"Post by " + message?.post?.poster?.username}
                                        height="100%"
                                        width="100%"
                                        className="object-cover opacity-1 h-full w-full"
                                    />
                                </div>
                            </div>
                        ) : message.messageType === MessageTypes.STORY ?
                            <div
                                className="cursor-pointer w-[200px] relative"
                                onClick={() => handleViewStory(message)}
                            >
                                <p className="absolute -top-5 text-sm font-semibold text-white">{message?.sender?.id === props?.currentUserId ? "You " : ""}Sent @{message?.story?.user?.username}'s Story</p>

                                <div className={`h-[20rem] min-w-[70%] !rounded-[18px] w-full overflow-hidden flex items-center justify-center`}>
                                    <img
                                        src={message?.story?.contentAddress || ""}
                                        onError={handleOnErrorImage}
                                        alt={"Story by " + message?.story?.user?.username}
                                        height={"100%"}
                                        width={"100%"}
                                        className="object-cover h-full w-full"
                                    />
                                </div>
                            </div>
                            : (
                                <div
                                    className="flex gap-2 items-center">
                                    <IconButton
                                        className="cursor-pointer text-[#5A8EBB]"
                                        onClick={() => handleFileDownload(message.contentAddress)}
                                    >
                                        <IconDownload size={25} />
                                    </IconButton>
                                    <p className="text-sm">{message.text || message.contentAddress || "File"}</p>
                                </div>
                            )}
                    </div>
                )}

                <div className={`mt-1 w-fit ${["POST", "STORY", "VIDEO", "PHOTO"].includes(message.messageType) ? "absolute bottom-1 left-3 !text-white" : ""} flex items-center justify-between gap-4 text-[10px] text-gray-900 dark:text-white`}>
                    <p>{generalTimeFormat(message.createdDate)}</p>
                    <span>
                        {message.sender.id !== props?.otherUserId && (
                            message?.status !== "PENDING"
                                ? <IconCheck size={12} />
                                : <IconClock size={12} />
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
});

export default Message;

interface MessageReplyPreviewProps {
    m: DirectMessage;
    props: MessagingProps
};

const MessageReplyPreview = memo(({ m, props }: MessageReplyPreviewProps) => {
    return m
        ? <div
            className={`!bg-gray-100 flex items-center justify-between px-2 py-1 mb-1 !rounded-[18px] ${m?.sender?.id === props?.otherUserId ? "rounded-bl-none bg-white text-black dark:bg-blue-500 dark:text-white" : "text-dark rounded-br-none bg-lime-100 text-left dark:bg-gray-700 dark:text-white"}`}
        >
            <div className="flex gap-3 items-center w-full">
                <div>
                    <h6 className="text-[#5A8EBB] font-semibold">{m?.sender?.id !== props?.currentUserId ? m?.sender?.username : "You"}</h6>
                    <div>{m?.messageType === MessageTypes.TEXT
                        ? Slice(m?.text, 40)
                        : m?.messageType === MessageTypes.PHOTO
                            ? <img
                                src={m?.contentAddress}
                                alt="Media"
                                onError={handleOnErrorImage}
                                className="rounded-lg w-10 h-10 object-cover"
                            />
                            : m?.messageType === MessageTypes.VIDEO
                                ? <video muted autoPlay={false} className="rounded-lg h-10 w-10 object-cover">
                                    <source src={m?.contentAddress} />
                                    Your browser does not support the video element.
                                </video>
                                : m?.messageType === MessageTypes.POST
                                    ? <img
                                        src={parsePostItems(m?.post?.postItemsString)[0]?.ThumNail || ""}
                                        onError={handleOnErrorImage}
                                        alt={"Post by " + m?.post?.poster?.username}
                                        className="rounded-lg w-10 h-10 object-cover"
                                    />
                                    : m?.messageType === MessageTypes.STORY
                                        ? <img
                                            src={m?.story?.contentAddress || ""}
                                            onError={handleOnErrorImage}
                                            alt={"Story by " + m?.story?.user?.username}
                                            className="rounded-lg w-10 h-10 object-cover"
                                        />
                                        : m?.messageType}
                    </div>
                </div>
            </div>
        </div>
        : null
});
