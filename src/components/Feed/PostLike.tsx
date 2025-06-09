import { memo, useEffect, useState } from "react";
import MobileIcons from "./MobileIcons";
import { useLikePost } from "../../app/services/mutations/likePost.mutation";
import { useUnLikePost } from "../../app/services/mutations/unLikePost.mutation";
import { PostData } from "../../types/Feed";
import Heart from "@/assets/icons/Heart";
import HeartFilled from "@/assets/icons/HeartFilled";

interface Props {
  orientation?: "horizontal" | "vertical";
  post: PostData | any;
  className?: string;
  size?: number | string;
  setShowLikes?: Function;
};

const PostLike = memo(({
  orientation = "vertical",
  post,
  className,
  size,
  setShowLikes,
}: Props) => {

  const [likeData, setLikeData] = useState<{ liked: boolean; count: number }>({ liked: post?.isLiked, count: post?.likeCount });
  const [animate, setAnimate] = useState(false);
  const { mutate: likePost } = useLikePost();
  const { mutate: unLikePost } = useUnLikePost();

  const handleLike = () => {
    // if (navigator.vibrate) {
    //   navigator.vibrate(50);
    // };

    setLikeData(prev => {
      setAnimate(true);
      if (prev.liked) {
        unLikePost({ postId: post?.Post ? post?.Post?.id : post?.post?.id });
        return { liked: false, count: prev.count - 1 };
      } else {
        likePost({ liked: true, postId: post?.Post ? post?.Post?.id : post?.post?.id })
        return { liked: true, count: prev.count + 1 };
      }
    });
  };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    };
  }, [animate]);

  return (
    <MobileIcons
      icon={
        likeData.liked ?
          <HeartFilled
            size={size}
            strokeWidth={1.4}
            className={`cursor-pointer text-green-500 fill-current
          ${animate ? "animate-like" : ""}
          ${className}`}
          />
          :
          <Heart
            size={size}
            strokeWidth={1.4}
            className={`cursor-pointer 
              ${animate ? "animate-like" : ""}
              ${className}`}
          />
      }
      onclick={handleLike}
      value={likeData.count}
      orientation={orientation}
      setShowLikes={() => setShowLikes?.({ id: post?.post?.id, viewCount: post?.viewCount })}
    />);
});

export default PostLike;
