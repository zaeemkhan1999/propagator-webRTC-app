import { useState, useRef, useEffect, memo } from "react";
import UserAvatar from "../Stories/components/UserAvatar";
import { IconArrowRight, IconDots, IconSpeakerphone } from "@tabler/icons-react";
import Title from "../Typography/Title";
import PostLike from "../Feed/PostLike";
import MobileIcons from "../Feed/MobileIcons";
import Share from "@/assets/icons/Share";
import Comment from "@/assets/icons/Comment";

const dummyReels = [
    {
        id: "1",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        needAds: true,
        post: {
            poster: { displayName: "Nike Official", id: 123 },
            yourMind: "Check out our latest sneakers! 🏀🔥",
            commentCount: 32,
            isSaved: false,
        },
    },
    {
        id: "2",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        needAds: true,
        post: {
            poster: { displayName: "Adidas Sports", id: 456 },
            yourMind: "New collection dropping soon! 🚀",
            commentCount: 21,
            isSaved: true,
        },
    },
];

const PromotedReels = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            if (event.deltaY > 0) nextReel();
            else if (event.deltaY < 0) prevReel();
        };
        window.addEventListener("wheel", handleScroll);
        return () => window.removeEventListener("wheel", handleScroll);
    }, [currentIndex]);

    const nextReel = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyReels.length);
    const prevReel = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? dummyReels.length - 1 : prevIndex - 1));

    useEffect(() => {
        if (videoRef.current) videoRef.current.play();
    }, [currentIndex]);

    const post = dummyReels[currentIndex].post;

    return (
        <div className="relative w-screen h-screen flex items-center justify-center bg-black">
            {dummyReels.map((reel, index) => (
                <video
                    key={reel.id}
                    ref={index === currentIndex ? videoRef : null}
                    src={reel.videoUrl}
                    className={`absolute w-full h-full object-cover transition-opacity duration-500 ${index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                    loop
                    autoPlay
                    muted
                    playsInline
                />
            ))}

            <div className="absolute bottom-10  text-white w-full p-4">
                <div className="flex items-center gap-3">
                    <UserAvatar isSelf user={post.poster} size="7" />
                    <p className="text-white font-bold">{post.poster.displayName}</p>
                    <button className="ml-2 rounded-lg border border-white bg-transparent px-3 py-1 text-xs font-bold">
                        Follow
                    </button>
                </div>

                {dummyReels[currentIndex].needAds && (
                    <div className="mt-2 flex items-center gap-1 rounded-md bg-gray-300/30 text-white justify-between text-sm p-2 w-[70%]">
                        <p>Shop Now</p>
                        <IconArrowRight size={20} />
                    </div>
                )}

                <div className="mt-2">
                    <Title className="text-sm text-white">{post.yourMind}</Title>
                </div>

                {dummyReels[currentIndex].needAds && (
                    <div className="mt-2 flex items-center gap-1 rounded-full bg-gray-400/20 text-white justify-center text-xs w-fit p-1 px-2">
                        <IconSpeakerphone size={15} />
                        <p>Sponsored</p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-10 right-3 flex flex-col gap-4 text-white">
                <PostLike size={32} className="w-[30px]" post={post} />
                <MobileIcons icon={<Comment color="white" size={27} />} value={post.commentCount} />
                <MobileIcons icon={<Share color="white" size={27} />} />
                <MobileIcons icon={<IconDots size={32} />} />
            </div>
        </div>
    );
};

export default memo(PromotedReels);