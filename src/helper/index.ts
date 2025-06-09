import { type SyntheticEvent } from "react";
import Logo from "@/assets/images/nothumb.png";

export type ParsePostItemsReturnType = {
  Order: number;
  Width: number;
  Height: number;
  Content: string;
  ThumNail: string;
  VideoTime: string;
  VideoShape: string;
  SummaryVideoLink: string;
  PostItemType: any;
};

export function parsePostItems(
  postItems: string
): Array<ParsePostItemsReturnType> | undefined {
  if (!postItems) return;
  return JSON.parse(postItems);
}

export function getFirstLetter(text?: string | null) {
  if (!text) return;
  return text?.charAt(0).toUpperCase();
}

export const copyTextToClipboard = (text: string, cbCopy?: () => void) => {
  if (typeof navigator?.clipboard?.writeText === 'function') {
    try {
      navigator.clipboard.writeText(text);
      cbCopy && cbCopy();
    } catch (err) { }
  } else {
    const el = document.createElement('textarea');
    el.value = text;

    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    cbCopy && cbCopy();
    document.body.removeChild(el);
  }
};

export const Slice = (data?: string, length = 10) => {
  if (!data) return '';

  let newData = data;

  if (data?.length > length) {
    newData = data?.slice(0, length) + '...';
  }

  return newData;
}

export const capitalizeFirstString = (input: any) => {
  if (input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  } else {
    return null;
  }
};

export function randomString(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const isVideo = (item: any) => {
  if (!item) return false;
  return /\.(mp4|webm|ogg|mkv|mov|avi|flv|wmv|m4v|m3u8)$/i.test(item);
};

export const isImage = (item: any) => {
  if (!item) return false;
  return /\.(jpg|jpeg|png|webp|gif|bmp|tiff|svg|ico)$/i.test(item);
};

export const handleOnErrorImage = (e: SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.src = Logo;
};

export const handleOnErrorVideoPoster = (id: string) => {
  const videoElement = document.getElementById(id) as HTMLVideoElement;
  if (videoElement) {
    videoElement.poster = Logo;
  }
};

export const formatTime = (seconds: any) => {
  if (!seconds || isNaN(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const parsePostItemsHome = (postItemsString: string | null) => {
  if (!postItemsString) return [];
  try {
    return JSON.parse(postItemsString)[0];
  } catch (error) {
    console.error("Error parsing postItemsString:", error);
    return [];
  };
};

export function extractFileNameAndFormat(filePath: any) {
  const regex = /(.+)\.([a-zA-Z0-9]+)$/;

  const match = filePath.match(regex);

  if (match) {
    const fileName = match[1];
    const fileFormat = match[2];

    return {
      fileName: fileName,
      fileFormat: fileFormat,
    };
  } else {
    return null;
  };
};
