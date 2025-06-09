import React, { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Slider from "@mui/material/Slider";

interface VideoJSPlayerProps {
    src: string;
    type?: string;
    playerRef?: (instance: any) => void;
    className?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    playsInline?: boolean;
    responsive?: boolean;
    preload: string;
    fullScreen?: any;
    key?: any;
    inView?: any;
}

const VideoJSPlayer: React.FC<VideoJSPlayerProps> = ({
    src,
    type = "video/mp4",
    playerRef,
    className = "",
    autoplay = false,
    loop = false,
    muted,
    controls = true,
    playsInline,
    responsive = true,
    preload = "auto",
    key,
    inView
}) => {
    const videoNodeRef = useRef<HTMLDivElement>(null);
    const internalPlayerRef = useRef<any>(null);

    const [currentProgress, setCurrentProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    useEffect(() => {
        if (internalPlayerRef.current) {
            internalPlayerRef.current.dispose();
            internalPlayerRef.current = null;
        }
        if (!internalPlayerRef.current && videoNodeRef.current) {
            if (videoNodeRef.current.firstChild) {
                return;
            }
            const videoElement = document.createElement("video-js");
            videoElement.classList.add("vjs-big-play-centered");
            videoNodeRef.current.appendChild(videoElement);
            const player = (internalPlayerRef.current = videojs(videoElement, {
                autoplay,
                loop,
                muted,
                controls,
                responsive,
                fluid: responsive,
                playsInline,
                preload,
                enableSmoothSeeking: true,
                sources: [
                    {
                        src,
                        type: src.includes(".m3u8") ? "application/x-mpegURL" : "video/mp4",
                    },
                ],
            }));
            player.on("error", () => {
                const error = player.error();
                if (error) {
                    console.error("Video.js encountered an error:", error);
                    player.src(src);
                    player.currentTime(0);
                    player?.play()?.catch(() => {
                        console.error("Failed to play video from cache, retrying with internet.");
                        player.src(src);
                        player?.play()?.catch(console.error);
                    });
                }
            });
            if (videoElement) {
                const videoTag = videoElement.querySelector("video");
                if (videoTag) {
                    videoTag.setAttribute("playsinline", "true");
                }
            }
            if (playerRef) {
                playerRef(player);
            }
        }

        return () => {
            if (internalPlayerRef.current) {
                internalPlayerRef.current.dispose();
                internalPlayerRef.current = null;
            }
        };
    }, [src]);

    useEffect(() => {
        if (internalPlayerRef.current) {
            internalPlayerRef.current.muted(muted);
        }
    }, [muted]);

    useEffect(() => {
        if (internalPlayerRef.current) {
            internalPlayerRef.current.on("timeupdate", () => {
                const current = internalPlayerRef.current.currentTime() || 0;
                const duration = internalPlayerRef.current.duration() || 0;

                setCurrentTime(current);
                setTotalDuration(duration);
                setCurrentProgress((current / duration) * 100 || 0);
            });
        }
    }, []);


    const handleSliderChange = useCallback(
        (event: Event, value: number | number[], activeThumb: number) => {
            const player = internalPlayerRef.current;
            const newTime = (typeof value === "number" ? value : value[activeThumb]) / 100 * player.duration();
            player.currentTime(newTime);
            setIsSeeking(true);
        },
        []
    );

    const handleSliderChangeCommitted = useCallback(() => {
        const player = internalPlayerRef.current;
        player.play();
        setIsSeeking(false);
    }, []);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    return (
        <div key={key} className={`relative vignette video-container h-full ${className}`}>
            <div className="!h-full min-h-[200px]" ref={videoNodeRef} />
            {isSeeking && (
                <div
                    className="absolute  bottom-[30px] left-[50%] -translate-x-[50%] text-white text-2xl z-90 px-2 py-1 rounded-md bg-gray-700"
                    style={{ fontFamily: "Arial, sans-serif" }}
                >
                    {formatTime(currentTime)} / {formatTime(totalDuration)}
                </div>
            )}
            <Slider
                className="video-seekbar py-0"
                value={currentProgress}
                onChange={handleSliderChange}
                onChangeCommitted={handleSliderChangeCommitted}
                aria-label="Video Progress"
                sx={{
                    color: "white",
                    height: 2,
                    "& .MuiSlider-thumb": {
                        width: 0,
                        height: 0,
                        backgroundColor: "white",
                        opacity: 0,
                    },
                    "& .MuiSlider-track": {
                        height: 2,
                        backgroundColor: "white",
                    },
                    "& .MuiSlider-rail": {
                        height: 2,
                        backgroundColor: "lightgray",
                    },
                }}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 80,
                }}
            />
        </div>
    );
};

export default React.memo(VideoJSPlayer);