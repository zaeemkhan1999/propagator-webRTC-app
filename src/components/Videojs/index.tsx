import { memo, useEffect, useRef, useState, useCallback } from "react";
import Slider from "@mui/material/Slider";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { IconArrowsDiagonal, IconVolume, IconVolume3 } from "@tabler/icons-react";
import { ExtendedDocument } from "./types";
// import { useTapHandler } from "./touchHandler";
import './style.css';
import { formatTime } from "@/helper";

// const EVENTS = [
//   'loadstart',
//   'progress',
//   'suspend',
//   'abort',
//   'error',
//   'emptied',
//   'stalled',
//   'loadedmetadata',
//   'loadeddata',
//   'canplay',
//   'canplaythrough',
//   'playing',
//   'waiting',
//   'seeking',
//   'seeked',
//   'ended',
//   'durationchange',
//   'timeupdate',
//   'play',
//   'pause',
//   'ratechange',
//   'resize',
//   'volumechange',
// ];

export const VideoJS = memo(({ options, onReady, playerRef, seekbarPosition, inView }: any) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isMute, setIsMute] = useState(false);
  const [showVolumeIcon, setShowVolumeIcon] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const handleVideoClick = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      if (player.muted()) {
        player.muted(false);
        setIsMute(false);
      } else {
        player.muted(true);
        setIsMute(true);
      }
      setShowVolumeIcon(true);
      setTimeout(() => {
        setShowVolumeIcon(false);
      }, 1000);
    }
  }, [isMute]);

  const handleTimeUpdate = useCallback(() => {
    const player = playerRef.current;
    setCurrentTime(player.currentTime());
    setTotalDuration(player.duration());
    const progress = (player.currentTime() / player.duration()) * 100;
    setCurrentProgress(progress);
  }, []);

  const handleSliderChange = useCallback((event: Event, value: number | number[], activeThumb: number) => {
    const player = playerRef.current;
    const newTime = (typeof value === 'number' ? value : value[activeThumb]) / 100 * player.duration();
    player.currentTime(newTime);
    setIsSeeking(true);
  }, []);

  const handleSliderChangeCommitted = useCallback(() => {
    const player = playerRef.current;
    player.play();
    setIsSeeking(false);
  }, []);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoElement.setAttribute("playsinline", "true");
      videoRef.current?.appendChild(videoElement);
      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady?.(player);
        player.on("timeupdate", handleTimeUpdate);
      }));
    } else {
      playerRef.current.autoplay(options.autoplay);
      playerRef.current.src(options.sources);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, handleTimeUpdate, inView]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (inView) {
      if (!player.src() && options.sources[0].src.includes(".m3u8")) {
        player.src(options.sources);
      }
      player.play().catch(() => {
        player.muted(true);
        player.play();
      });
    } else {
      if (options.sources[0].src.includes(".m3u8")) {
        player.src("");
      }
      player.pause();
    }
  }, [inView]);

  interface ExtendedScreenOrientation extends ScreenOrientation {
    lock?(orientation: string): Promise<void>;
  };

  const handleFullscreenToggle = (element: HTMLElement | null) => {
    if (element) {
      const doc = document as ExtendedDocument;
      const orientation = screen.orientation as ExtendedScreenOrientation;
      const isFullscreen = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;

      if (!isFullscreen) {
        const requestFullscreen =
          element.requestFullscreen ||
          (element as any).webkitRequestFullscreen ||
          (element as any).mozRequestFullScreen ||
          (element as any).msRequestFullscreen;

        requestFullscreen?.call(element)
          .then(() => orientation.lock?.("landscape").catch(console.error))
          .catch(console.error);
      } else {
        const exitFullscreen =
          document.exitFullscreen ||
          doc.webkitExitFullscreen ||
          doc.mozCancelFullScreen ||
          doc.msExitFullscreen;

        exitFullscreen?.call(document)
          .then(() => orientation.unlock?.())
          .catch(console.error);
      }
    }
  };

  // const { handleTouchStart, handleTouchEnd } = useTapHandler({
  //   onTap: handleVideoClick,
  // });

  return (
    <div className={`relative h-full`} data-vjs-player>
      <div className="h-full vignette"
        onClick={handleVideoClick}
        // onTouchStart={handleTouchStart}
        // onTouchEnd={handleTouchEnd}
        ref={videoRef} />
      {showVolumeIcon && (
        <div className="absolute top-0 left-0 z-50 w-full h-full flex items-center justify-center text-white mute-icon">
          <div className="w-20 h-20 bg-gray-700/60 rounded-full flex items-center justify-center">
            {isMute ? <IconVolume3 size={32} /> : <IconVolume size={32} />}
          </div>
        </div>
      )}
      <div className="relative">
        {isSeeking && <div
          className="absolute bottom-[70px] left-[50%] -translate-x-[50%] text-white text-2xl z-90 px-2 py-1 rounded-md bg-[#2f2f2f]"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </div>}
        <Slider
          className="video-seekbar py-0"
          value={currentProgress}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderChangeCommitted}
          aria-label="Video Progress"

          sx={{
            color: "lightgray",
            height: 2,
            "& .MuiSlider-thumb": {
              width: 0,
              height: 0,
              backgroundColor: "white",
              opacity: 0,
            },
            "& .MuiSlider-track": {
              height: 2,
              backgroundColor: "grey",
            },
            "& .MuiSlider-rail": {
              height: 2,
              backgroundColor: "transparent",
              opacity: 1,
            },
          }}
          style={{
            position: "absolute",
            bottom: seekbarPosition || `53px`,
            left: 0,
            right: 0,
            zIndex: 80,
          }}
        />

        <button
          onClick={() => handleFullscreenToggle(videoRef.current)}
          className={`absolute bottom-[80px] right-4 text-white full-screen-icon hidden }`}
        >
          <IconArrowsDiagonal size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
});

export default VideoJS;
