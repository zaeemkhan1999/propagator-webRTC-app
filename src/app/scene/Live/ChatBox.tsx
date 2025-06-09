import {
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./style.module.css";
import { User } from "./types";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import { Typography } from "@mui/material";
import { IconSend } from "@tabler/icons-react";
import type { Socket } from "socket.io-client";
import { SocketEvents } from "./SocketEvents";

type Message = {
  value: string;
  userId: User["id"];
  username: User["username"];
};

function ChatBox({
  showChatbox,
  setShowChatbox,
  setUnseenMsgCount,
  socket,
}: {
  showChatbox: boolean;
  setShowChatbox: Dispatch<SetStateAction<boolean>>;
  setUnseenMsgCount: Dispatch<SetStateAction<number>>;
  socket: Socket;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useSnapshot(userStore.store).user;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on(SocketEvents.MESSAGE_RECEIVE, (messages: Message[]) => {
      setMessages(messages);
    });
    return () => {
      socket.off(SocketEvents.MESSAGE_RECEIVE);
    };
  }, []);

  const handleSendMessage = () => {
    const message = messageInputRef.current?.value.trim();
    if (message) {
      socket.emit(SocketEvents.MESSAGE_SEND, { message });
      if (messageInputRef.current) {
        messageInputRef.current.value = "";
      }
    }
  };

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      chatboxRef.current &&
      !chatboxRef.current.contains(event.target as Node)
    ) {
      setShowChatbox(false);
    }
  };

  useEffect(() => {
    if (showChatbox) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatbox]);

  if (!showChatbox) return null;
  return (
    <div className={styles.chatbox}>
      <div className={styles.chatBoxInner} ref={chatboxRef}>
        <div className={styles.messageList}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.userId === user?.id
                  ? styles.localMessage
                  : styles.remoteMessage
              }
            >
              {message.userId === user?.id ? (
                <>
                  {" "}
                  <span className={styles.chatText}>{message.value}</span>{" "}
                  <span className={styles.chatInitial}>me</span>
                </>
              ) : (
                <>
                  {" "}
                  <span className={styles.chatInitial}>
                    {message.username}
                  </span>{" "}
                  <span className={styles.chatText}>{message.value}</span>{" "}
                </>
              )}
            </div>
          ))}
          {messages.length === 0 && (
            <Typography className="text-center text-white/60">
              No Messages Yet!
            </Typography>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.messageInput}>
          <input
            type="text"
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            ref={messageInputRef}
          />
          <button onClick={handleSendMessage}>
            <IconSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
