import React from 'react';
import { useExportConversation } from '../queries/getConversation';
import { CircularProgress } from '@mui/material';
import { parsePostItems } from '@/components/Grid/utils';
import FileArrowRight from '@/assets/icons/FileRight';

interface ExportChatButtonProps {
  currentUserId?: number;
  conversationId: number;
}

const ExportChatButton: React.FC<ExportChatButtonProps> = ({ currentUserId, conversationId, ...props }) => {
  const { loading, exportMyConversation } = useExportConversation();

  const handleExport = async () => {
    exportMyConversation(conversationId, (result: any) => {
      const messages = result;
      if (messages && Array.isArray(messages)) {
        const chatContent = messages
          .map((message) => {
            const senderName = message.sender?.displayName || message?.senderId;
            const text = message?.text || "(No text provided)";
            const messageDate = new Date(message?.createdDate).toLocaleString();
            const isOtherUser = message.senderId !== currentUserId;

            return `
            
            <div class="flex ${isOtherUser ? "justify-start text-start" : "justify-end text-end"}">
              <div style="border-radius: 12px; margin: 10px 0;" class="relative max-w-xs break-all rounded-[18px] px-3 py-2 shadow ${isOtherUser ? "rounded-bl-none bg-white text-black dark:bg-blue-500 dark:text-white" : "text-dark rounded-br-none bg-lime-100 text-left dark:bg-gray-700 dark:text-white"}">
                ${isOtherUser ? `
                  <div class="absolute -bottom-1 left-[-8px] h-0 w-0 rotate-[50deg] border-l-[8px] border-r-[10px] border-t-[15px] border-l-transparent border-r-transparent border-t-white dark:border-t-blue-500"></div>
                  <h4 style="margin: 5px 0;" class="text-[14px] font-bold text-violet-400">${senderName}</h4>
                ` : `
                  <h4 style="margin: 5px 0;" class="text-[14px] font-bold capitalize text-green-600">${senderName}</h4>
                  <div class="absolute -bottom-1 right-[-8px] h-0 w-0 rotate-[-50deg] border-l-[10px] border-r-[8px] border-t-[15px] border-l-transparent border-r-transparent border-t-lime-100 dark:border-t-gray-700"></div>
                `}
                ${!message.messageType || message.messageType === "TEXT" ? `
                  <p style="margin: 8px 0;" class="text-[14px]">${text}</p>
                ` : `
                  <div class="mt-2">
                    ${message.messageType === "PHOTO" ? `
                      <img src="${text}" alt="Message Media" class="w-full rounded-md h-60" />
                    ` : message.messageType === "VOICE" ? `
                      <audio controls class="w-full">
                        <source src="${text}" />
                        Your browser does not support the audio element.
                      </audio>
                    ` : message.messageType === "VIDEO" ? `
                      <video controls class="w-full rounded-md h-60">
                        <source src="${text}" />
                        Your browser does not support the video element.
                      </video>
                    ` : message.messageType === "POST" ? `
                      <div class="cursor-pointer min-w-[12rem]" onclick="window.open('/specter/view/post/${message?.post?.id}', '_blank')">
                        <div class="mb-3 flex items-center gap-2">
                          <div class="h-5 w-5 border ${!message?.post?.poster?.imageAddress && "bg-gray-200 text-sm text-black"}">
                            ${message?.post?.poster?.imageAddress ? `
                              <img src="${message?.post?.poster?.imageAddress}" />
                            ` : `
                              <p class='uppercase'>${message?.post?.poster?.username?.slice(0, 1)}</p>
                            `}
                          </div>
                          <p class="text-sm font-bold text-black">${message?.post?.poster?.username || ""}</p>
                        </div>
                        <div class="h-[10rem] w-full overflow-hidden flex items-center justify-center">
                          <img src="${parsePostItems(message?.post?.postItemsString)[0]?.ThumNail || ""}" alt="Post by ${message?.post?.poster?.username}" />
                        </div>
                      </div>
                    ` : message.messageType === "STORY" ? `
                      <div class="cursor-pointer min-w-[12rem]" onclick="window.open('${message?.story?.contentAddress}', '_blank')">
                        <div class="mb-3 flex items-center gap-2">
                          <div class="h-5 w-5 border ${!message?.story?.user?.imageAddress && "bg-gray-200 text-sm text-black"}">
                            ${message?.story?.user?.imageAddress ? `
                              <img src="${message?.story?.user?.imageAddress}" />
                            ` : `
                              <p>${message?.story?.user?.username?.slice(0, 1)}</p>
                            `}
                          </div>
                          <p class="text-sm font-bold text-black">${message?.story?.user?.username || ""}</p>
                        </div>
                        <div class="h-[10rem] w-full overflow-hidden flex items-center justify-center">
                          <img src="${message?.story?.contentAddress || ""}" alt="Story by ${message?.story?.user?.username}" />
                        </div>
                      </div>
                    ` : `
                      <p onclick="window.open('${text}', '_blank')">File: <span class="cursor-pointer" title="Click to Open">${text}</span></p>
                    `}
                  </div>
                `}
                <div class="mt-1 flex w-full items-center justify-between gap-4 text-[10px] text-gray-900 dark:text-white">
                  <p style="font-size: 12px; margin: 5px 0">${messageDate}</p>
                  <span style="font-size: 12px; ">${message.sender.id !== message.sender.id ? `<svg width="12" height="12"><path d="M1 5l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none" fill-rule="evenodd"/></svg>` : ''}</span>
                </div>
              </div>
            </div>
          `;
          })
          .join("");

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Conversation Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding:0; margin:0;  }
            .message { margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #ccc; }
            .message-header { font-weight: bold; margin-bottom: 5px; }
            .sender-name { color: #007bff; }
            .message-date { color: #6c757d; font-size: 0.9em; }
            .message-text { margin-top: 5px; }
            .flex { display: flex; }
            .justify-start { justify-content: flex-start; }
            .justify-end { justify-content: flex-end; }
            .text-start { text-align: left; }
            .text-end { text-align: right; }
            .relative { position: relative; }
            .max-w-xs { max-width: 20rem; }
            .break-all { word-break: break-all; }
            .rounded-[18px] { border-radius: 18px; }
            .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
            .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
            .shadow { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
            .rounded-bl-none { border-bottom-left-radius: 0; }
            .bg-white { background-color: #fff; }
            .text-black { color: #000; }
            .text-dark { color: #343a40; }
            .rounded-br-none { border-bottom-right-radius: 0; }
            .bg-lime-100 { background-color: #f7f7f7; }
            .text-left { text-align: left; }

            .text-[14px] { font-size: 14px; }
            .mt-2 { margin-top: 0.5rem; }
            .w-full { width: 100%; }
            .rounded-md { border-radius: 0.375rem; }
            .h-60 { height: 15rem; }
            .cursor-pointer { cursor: pointer; }
            .min-w-[12rem] { min-width: 12rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .gap-2 { gap: 0.5rem; }
            .h-5 { height: 1.25rem; }
            .w-5 { width: 1.25rem; }
            .border { border-width: 1px; }
            .bg-gray-200 { background-color: #e5e7eb; }
            .text-sm { font-size: 0.875rem; }
            .text-black { color: #000; }
            .uppercase { text-transform: uppercase; }
            .font-bold { font-weight: 700; }
            .text-violet-400 { color: #a78bfa; }
            .capitalize { text-transform: capitalize; }
            .text-green-600 { color: #16a34a; }
            .absolute { position: absolute; }
            .-bottom-1 { bottom: -0.25rem; }
            .left-[-8px] { left: -8px; }
            .h-0 { height: 0; }
            .w-0 { width: 0; }
            .rotate-[50deg] { transform: rotate(50deg); }
            .border-l-[8px] { border-left-width: 8px; }
            .border-r-[10px] { border-right-width: 10px; }
            .border-t-[15px] { border-top-width: 15px; }
            .border-l-transparent { border-left-color: transparent; }
            .border-r-transparent { border-right-color: transparent; }
            .border-t-white { border-top-color: #fff; }
            .right-[-8px] { right: -8px; }
            .rotate-[-50deg] { transform: rotate(-50deg); }
            .border-t-lime-100 { border-top-color: #f7f7f7; }
            .mt-1 { margin-top: 0.25rem; }
            .gap-4 { gap: 1rem; }
            .text-[10px] { font-size: 10px; }
            .text-gray-900 { color: #1f2937; }
          </style>
        </head>
        <body>
        <div style="max-width: 800px; margin: 0 auto; padding: 20px; background-color: #86efac; height: 100%; min-height: 100vh; ">
          ${chatContent}
          </div>
        </body>
        </html>
      `;

        const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "conversation_export.html";
        link.click();
        console.log("Conversation exported successfully.");
      } else {
        console.error("Failed to export conversation: No valid message data received.");
      }
    });
  };

  return (
    <button
      className="flex items-center gap-4 text-dark dark:text-gray-300"
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? (
        <span><CircularProgress size={20} /></span>
      ) : (
        <FileArrowRight size={24} fontSize="small" />
      )}
      {loading ? "Exporting..." : "Export Chat"}
    </button>
  );
};

export default ExportChatButton;