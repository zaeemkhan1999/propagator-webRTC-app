export const getMediaConstraints = (
  isMobile: boolean,
): MediaStreamConstraints => ({
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 60 },
    facingMode: { ideal: "user" },
    aspectRatio: { ideal: 16 / 9 },
  },

  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: isMobile ? 16000 : 44100,
    autoGainControl: true,
  },
});

export const getInitials = (fullname: string | undefined) =>
  fullname
    ?.split(" ")
    .map((word) => word[0])
    .join()
    .toUpperCase();

export const getIsMobile = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
