import { IconBookmark } from "@tabler/icons-react";
import { useState } from "react";

function Bookmark({ isSaved }: { isSaved: boolean }) {
  const handleBookmark = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setIsBookmarked(!isBookmarked)
  };
  const [isBookmarked, setIsBookmarked] = useState(isSaved);
  return (
    <IconBookmark
      className={`cursor-pointer ${isBookmarked ? "text-yellow-500 fill-current" : ""
        }`}
      strokeWidth={1.4}
      onClick={handleBookmark}
    />
  );
}

export default Bookmark;
