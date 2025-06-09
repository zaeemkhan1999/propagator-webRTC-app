import config from "../config/index.dev";

export function getFullImageUrl(url?: string, customSize?: string) {
  if (customSize) {
    // return `${config.AWS_BUCKET_URL}${url}`;
    return url;
  } else if (url) {
    if (url?.includes?.(config.AWS_BUCKET_URL)) return url;
    return url;
    //return `${config.AWS_BUCKET_URL}${url}`;
  } else {
    return;
  }
}

export function cn(...classNames: (string | undefined | boolean)[]) {
  return classNames.filter(Boolean).join(" ");
}
