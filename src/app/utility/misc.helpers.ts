import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

export const hexToRgbA = (hex: any, opacity: any) => {
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join("")}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(
      ","
    )},${opacity})`;
  }
};

export function createCaptcha(id: string): void {
  const captchaContainer = document.getElementById(id);
  if (!captchaContainer) {
    console.error(`Element with id "${id}" not found.`);
    return;
  }

  captchaContainer.innerHTML = "";

  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
  const lengthOtp = 10;
  const captcha: string[] = [];

  for (let i = 0; i < lengthOtp; i++) {
    // Ensure no character repetition
    let index: number;
    do {
      index = Math.floor(Math.random() * chars.length);
    } while (captcha.indexOf(chars[index]) !== -1); // Loop if character is already in the captcha

    captcha.push(chars[index]);
  }

  const captchaString = captcha.join("");

  const canv: HTMLCanvasElement = document.createElement("canvas");
  canv.id = "captcha";
  canv.width = 160;
  canv.height = 50;

  // Store the captcha text in a data attribute on the canvas element
  canv.setAttribute("data-c", captchaString);

  const ctx: CanvasRenderingContext2D | null = canv.getContext("2d");
  if (ctx) {
    ctx.font = "25px Georgia";
    ctx.strokeText(captchaString, 0, 30);
  } else {
    console.error("Failed to get canvas context.");
    return;
  }

  captchaContainer.appendChild(canv);
};

export const getCaptchaValue = (id: string): string => {
  const captchaCanvas = document.querySelector(`#${id} canvas`);
  if (captchaCanvas) {
    return captchaCanvas.getAttribute("data-c") || '';
  }
  return '';
};

export const isUserLoggedIn = () => {
  const access_Token = userStore.store.authentication.access_Token;
  const isLoggedIn = userStore.store.authentication.status === "loggedIn";

  if (!access_Token || !isLoggedIn) {
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(access_Token);
    const currentTime = Date.now() / 1000;

    if (decodedToken?.exp < currentTime) {
      userStore.actions.clearUser();
      return false;
    }

    return true;
  } catch (error) {
    userStore.actions.clearUser();
    return false;
  }
};

export function truncateString(text: string, limit: number) {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

export function randomUuidV4() {
  return uuidv4();
}

export const isVideo = (item: any) => {
  if (!item) {
    return;
  }
  return /\.(mp4|webm|ogg|mkv|mov|avi|3gp|flv|wmv|m4v|m3u8)$/i.test(item);
};

export const formatDateForInput = (date: any) => {
  const inputDate = dayjs(date, 'DD-MM-YYYY');
  if (inputDate.isValid()) {
    return inputDate.format("YYYY-MM-DD");
  }
  return "";
};

export const generalDateFormat = (date: string | Date, format = 'DD/MM/YYYY') => {
  return date ? dayjs(date).format(format) : "";
};

export const generalTimeFormat = (time: string, format = "hh:mm A") => {
  return time ? dayjs(time).format(format) : "";
};

export const DaysAgo = (date: any) => {
  const givenDate = dayjs(date);
  const now = dayjs();

  const diffInMinutes = now.diff(givenDate, 'minutes');
  const diffInHours = now.diff(givenDate, 'hours');
  const diffInDays = now.diff(givenDate, 'days');
  const diffInMonths = now.diff(givenDate, 'months');
  const diffInYears = now.diff(givenDate, 'years');

  // For times less than a minute
  if (diffInMinutes < 1) {
    return 'just now';
  }

  // For minutes (less than 1 hour)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min ago`;
  }

  // For hours (less than 1 day)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  // For days (less than 1 month)
  if (diffInDays < 30) {
    return `${diffInDays} day ago`;
  }

  // For months (less than 1 year)
  if (diffInMonths < 12) {
    return `${diffInMonths} mon ago`;
  }

  // For years
  return `${diffInYears} yr ago`;
};


import { useEffect, useState } from "react";
import { userStore } from "../../store/user";

const useScreenDetector = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;
  const isTablet = width <= 1024;
  const isDesktop = width > 1024;

  return { isMobile, isTablet, isDesktop };
};

export default useScreenDetector;

export function isValidURL(input: string) {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-zA-Z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!urlPattern.test(input);
}

export const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' }); // E.g., Jan, Feb
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // If hours is 0, set to 12 (midnight)

  return `${day}-${month}-${year} ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

export function extractHashtags(postContent: string): string[] {
  const hashtagRegex = /#[\w]+/g;
  const matches = postContent.match(hashtagRegex) || [];
  return Array.from(new Set(matches));
}

export function extractLinks(postContent: string): string[] {
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  const matches = postContent.match(linkRegex) || [];
  return Array.from(new Set(matches));
}