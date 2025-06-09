import { useState } from 'react';
import useGetPostsInAdvancedWay from '../../../queries/getPostsInAdvanceWay';
import { GetPostType } from '@/constants/storage/constant';
import SearchBar from "@/app/scene/Explore/Components/SearchBar";
import { handleOnErrorImage, Slice } from "@/helper";
import { useClickAway } from "@uidotdev/usehooks";
import SearchIcon from "@/assets/sidebar/search";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { parsePostItems } from "@/components/Grid/utils";
import { isVideo } from "@/app/utility/misc.helpers";
import { useNavigate } from 'react-router-dom';

const VideoSearch = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    const {
        data: suggestions,
        getData: getSuggestions,
        setData: setSuggestions,
    } = useGetPostsInAdvancedWay({
        getPostType: GetPostType.Recommended,
        where: {
            post: {
                isCreatedInGroup: { eq: false },
                // aspectRatio: { eq: "16_9" },
                yourMind: { contains: searchTerm },
            },
        },
    }, true);

    const suggestionsRef: React.MutableRefObject<HTMLDivElement> = useClickAway(() => {
        setSuggestions([]);
        setSearchTerm('');
    });

    const handleSuggestionClick = () => {
        if (searchTerm && suggestions.length) {
            setSuggestions([]);
            navigate(`/specter/youtube/search/${searchTerm}`, { viewTransition: true });
            setTimeout(() => {
                window.scrollTo(-10000, -10000);
            }, 10);
        };
    };

    return (
        <div className="flex flex-1 relative max-w-[100%] mx-2">
            <SearchBar
                className={`my-2 h-10 w-full text-[14px] md:my-4 md:h-14 ${suggestions.length ? "rounded-b-none" : ""}`}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                cb={searchTerm ? getSuggestions : () => { }}
            />

            {!!suggestions.length &&
                <div className="absolute bg-white flex-1 z-[999] w-full md:top-16 top-12 left-0 rounded-b-lg p-2 " ref={suggestionsRef}>
                    <ul onClick={handleSuggestionClick}>
                        {suggestions.map((post) => (isVideo(parsePostItems(post?.postItemsString || '[]')[0]?.Content) &&
                            <li className="pt-1 flex items-center justify-between" key={post?.post?.id}>
                                <div className="text-gray-600 font-semibold flex items-center gap-1 pl-3 hover:bg-gray-100">
                                    <SearchIcon size={15} /> {Slice(post?.post?.yourMind, 35)}
                                </div>
                                <LazyLoadImage
                                    className="w-8 h-8 rounded-lg"
                                    src={parsePostItems(post?.postItemsString || '[]')[0]?.ThumNail || ''}
                                    alt="Thumbnail"
                                    onError={handleOnErrorImage}
                                />
                            </li>
                        ))}
                    </ul>
                </div>}
        </div>
    );
};

export default VideoSearch;
