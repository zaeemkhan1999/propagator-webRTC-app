import { memo, useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import '../videoJsPlayer/vjs-luxmty.css';

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
    poster?: string;
    layout?: string;
    showDuration?: boolean;
};

const VideoJSPlayerSkin = memo(({
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
    preload = "none",
    inView,
    poster,
    layout,
    showDuration = false,
}: VideoJSPlayerProps) => {
    const videoNodeRef = useRef<HTMLDivElement>(null);
    const internalPlayerRef = useRef<any>(null);
    const [duration, setDuration] = useState("0:00");

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
            videoElement.classList.add(
                "vjs-luxmty",
                "vjs-show-big-play-button-on-pause",
            );
            videoNodeRef.current.appendChild(videoElement);

            const player = (internalPlayerRef.current = videojs(videoElement, {
                autoplay,
                loop,
                muted,
                controls,
                responsive,
                fluid: responsive,
                playsInline,
                preload: preload ?? "none",
                poster,
                enableSmoothSeeking: true,
                sources: [
                    {
                        src: src ?? "",
                        type: src.includes(".m3u8") ? "application/x-mpegURL" : "video/mp4",
                    },
                ],
            }));

            player.on("loadedmetadata", () => {
                const totalSeconds = player.duration();
                if (typeof totalSeconds === "number" && !isNaN(totalSeconds)) {
                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
                    setDuration(`${minutes}:${seconds}`);
                } else {
                    setDuration("0:00");
                }
            });

            player.on("error", () => {
                const error = player.error();
                if (error) {
                    player.src(src);
                    player.currentTime(0);
                    player?.play()?.catch(() => {
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

    return (
        <div className={`relative vignette video-container h-full ${className}`}>
            <div className={`!h-full min-h-[150px] ${layout}`} ref={videoNodeRef} />
            {showDuration && <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                {duration}
            </div>}
        </div>
    );
});

export default VideoJSPlayerSkin;
