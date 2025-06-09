import { useEffect, useState, } from "react";
import { Typography, IconButton, Pagination } from "@mui/material";
import { IconHome2, IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import VideoCard from "./components/VideoCard";
import useGetPostsInAdvancedWay, { PER_PAGE_COUNT } from "../../queries/getPostsInAdvanceWay";
import { GetPostType } from "@/constants/storage/constant";
import Shorts from "./components/Shorts";
import VideoCardSkeleton from "./components/VideoSkeleton";
import { parsePostItems } from "@/components/Grid/utils";
import { isVideo } from "@/app/utility/misc.helpers";
import VideoSearch from "./components/VideoSearch";

interface Props {
    needTopPadding?: boolean;
};

const YoutubePage = ({ needTopPadding }: Props) => {
    const navigate = useNavigate();

    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        showSearch && document.getElementById('searchInput')?.focus();
    }, [showSearch]);

    const {
        data,
        getData,
        fetchSpecificPage,
        isLoading,
        total,
        skip,
    } = useGetPostsInAdvancedWay({
        getPostType: GetPostType.Recommended,
        where: {
            post: {
                isCreatedInGroup: { eq: false },
                // aspectRatio: { eq: "16_9" },
            },
        },
    });

    useEffect(() => {
        getData();
    }, []);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        const newSkip = (page - 1) * PER_PAGE_COUNT;
        fetchSpecificPage(newSkip);
        setTimeout(() => {
            window.scrollTo(-10000, -10000);
        }, 10);
    };

    const handleVideoClick = (id: number) => {
        if (id) {
            navigate(`/specter/youtube/watch/${id}`, { state: { props: { nextVideos: data } }, viewTransition: true });
            setTimeout(() => {
                window.scrollTo(-10000, -10000);
            }, 10);
        };
    };

    return (
        <div className={`flex flex-col overflow-y-auto bg-[#0f0f0f] h-screen pb-4 ${needTopPadding ? "pt-10" : ""}`}>
            <header className="flex items-center justify-between p-0 md:p-4 bg-[#0f0f0f] opacity-90 text-white shadow-sm">
                {needTopPadding ?
                    <div></div>
                    : <IconButton><IconHome2 onClick={() => navigate('/specter/home')} color="white" size={24} /></IconButton>}
                <h1 className={`${needTopPadding ? 'pl-7' : ''} font-bold text-xl`}>Long Videos</h1>
                <IconButton onClick={() => setShowSearch(prev => !prev)}><IconSearch color="white" size={24} /></IconButton>
            </header>

            {showSearch && <VideoSearch />}

            <div className="block">
                <div className="p-2">
                    <Shorts />
                </div>
                <Typography variant="h6" className="text-white mb-2 px-2">Recommended Videos</Typography>
                <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-0 md:p-4">
                    {isLoading
                        ? <VideoCardSkeleton />
                        : data.map((post) => (isVideo(parsePostItems(post?.postItemsString || '[]')[0]?.Content) &&
                            <>
                                <VideoCard
                                    key={post?.post?.id}
                                    video={post}
                                    handleVideoClick={handleVideoClick}
                                    layout={post?.post?.aspectRatio === "ORIGINAL" ? "portrait-layout" : "landscape-layout"}
                                />
                            </>

                        ))}
                </main>

                {data.length &&
                    <div className="flex justify-center mt-4">
                        <Pagination
                            count={Math.ceil(total / PER_PAGE_COUNT)}
                            page={Math.floor((skip / PER_PAGE_COUNT) + 1)}
                            onChange={handlePageChange}
                            color="standard"
                            variant="outlined"
                            shape="rounded"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: 'gray',
                                },
                                '& .Mui-selected': {
                                    backgroundColor: 'gray',
                                    color: 'white',
                                },
                                '& .MuiPaginationItem-page:hover': {
                                    backgroundColor: 'lightgray',
                                },
                            }}
                        />
                    </div>}
            </div>
        </div>);
};

export default YoutubePage;
