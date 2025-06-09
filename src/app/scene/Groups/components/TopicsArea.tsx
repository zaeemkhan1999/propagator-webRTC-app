import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, CircularProgress, Dialog, DialogContent, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { GroupTopic } from '../queries/getGroupTopics';
import { filterAndSortOptions, GroupPost, NoDiscussion, Scrolls } from './GroupDetail';
import SubmitBtn from '@/components/Buttons';
import { DiscussionItem, useGetDiscussions } from '../queries/getGroupDiscussion.query';
import { SortEnumType } from '@/constants/storage/constant';
import { ArticleItem } from '../../Explore/queries/getExploreScrolls';
import ArrowLeft from '@/assets/icons/ArrowLeft';
import Filter from '@/assets/icons/IconFilter';
import Plus from '@/assets/icons/IconPlus';
import { useSnapshot } from 'valtio';
import { userStore } from '@/store/user';

const TopicsArea = () => {
    const user = useSnapshot(userStore.store).user;

    const navigate = useNavigate();
    const { state } = useLocation();
    const { topic }: { topic: GroupTopic & { groupId: number } } = state?.props || {};

    useEffect(() => {
        if (!topic || !state) navigate("/specter/groups");
    }, []);

    const queryParams = new URLSearchParams(window.location.search);
    const lastDiscussionRef = useRef<HTMLDivElement | null>(null);

    const [openFilters, setOpenFilters] = useState(false);
    const [openCreateContentModal, setOpenCreateContentModal] = useState<boolean>(false);
    const [selectedFilterAndSort, setSelectedFilterAndSort] = useState<{ filter: "Posts" | "Scrolls"; sort: "Asc" | "Desc" }>(
        { filter: queryParams.get("filter") === "Scrolls" ? "Scrolls" : "Posts", sort: "Desc" });

    const { data: discussionData, isLoading: loadingDiscussions, hasNextPage, fetchNextPage, isFetching, refetch: refetchDiscussions } = useGetDiscussions({
        skip: 0,
        take: 10,
        where: {
            isDeleted: { neq: true },
            groupTopicId: { eq: topic?.id },
            messageType: {
                eq: selectedFilterAndSort.filter === "Posts"
                    ? "POST"
                    : "ARTICLE"
            }
        },
        order: { createdDate: SortEnumType[selectedFilterAndSort.sort] },
    });

    useEffect(() => {
        if (topic?.id) {
            refetchDiscussions();
        }
    }, [selectedFilterAndSort.filter]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetching) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        if (lastDiscussionRef.current) {
            observer.observe(lastDiscussionRef.current);
        }

        return () => {
            if (lastDiscussionRef.current) {
                observer.unobserve(lastDiscussionRef.current);
            }
        };
    }, [hasNextPage, isFetching, fetchNextPage]);

    const transformedGroupArticles = useMemo(() => {
        return selectedFilterAndSort.filter === "Scrolls"
            ? (discussionData?.pages || [])?.flatMap(page => (
                page.message_getDiscussions?.result?.items.length
                    ? page?.message_getDiscussions?.result?.items?.map(d => {
                        return {
                            article: d.article,
                            isLiked: d.isLiked,
                            isNotInterested: d.isNotInterested,
                            isSaved: d.isSaved,
                            isYourArticle: d.isYours,
                            isViewed: d.isViewed,
                            createdDate: d.article?.createdDate ?? '',
                            commentCount: d.commentCount,
                            shareCount: d.shareCount,
                            viewCount: d.viewCount,
                            likeCount: d.likeCount,
                            articleItemsString: d.article?.articleItemsString ?? ''
                        } as ArticleItem;
                    })
                    : []
            ))
            : []
    }, [discussionData, selectedFilterAndSort.filter]);

    return (
        <div className='h-full overflow-y-auto !bg-[#090909] text-white'>
            <div className='flex justify-between items-center p-3 bg-[#5A8EBB] dark:bg-blue-950/80 text-white'>
                <ArrowLeft onClick={() => navigate("/specter/groups/" + topic?.groupId)} />
                <div className='flex items-center gap-1.5'>
                    <Typography variant='subtitle1'>{topic?.title}</Typography>
                    <Filter size={18} onClick={() => setOpenFilters(true)} />
                </div>
                <Plus onClick={() => setOpenCreateContentModal(true)} />
            </div>

            <div className='h-screen overflow-y-auto'>
                <>
                    {loadingDiscussions
                        ? <div className="text-center"><CircularProgress /></div>
                        : selectedFilterAndSort.filter === "Posts"
                            ? discussionData?.pages.map(page => (
                                page.message_getDiscussions?.result?.items.length
                                    ? page.message_getDiscussions?.result?.items?.map((discussion: DiscussionItem) =>
                                    (<div key={discussion.id}>
                                        <GroupPost
                                            post={discussion}
                                            onDelete={refetchDiscussions}
                                            userId={user?.id}
                                        />
                                    </div>))
                                    : <NoDiscussion />))
                            : <Scrolls isCreatedInGroup groupArticles={transformedGroupArticles} />}

                    <div ref={lastDiscussionRef}></div>
                    {isFetching && !loadingDiscussions && <div className='text-center'><CircularProgress /></div>}
                </>

                <div ref={lastDiscussionRef}></div>
                {isFetching && !loadingDiscussions && <div className='text-center'><CircularProgress /></div>}
            </div>

            {/* filter Modal */}
            {openFilters &&
                <Dialog
                    open={openFilters}
                    onClose={() => setOpenFilters(false)}
                >
                    <DialogContent>
                        <div className="mt-5 px-5 pt-3">
                            {filterAndSortOptions.map((option) => (
                                <Box key={option.label} mb={3}>
                                    <Typography variant="h6">{option.label}</Typography>
                                    <RadioGroup
                                        value={option.label === "Sort By"
                                            ? selectedFilterAndSort.sort
                                            : selectedFilterAndSort.filter}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (option.label === "Sort By") {
                                                setSelectedFilterAndSort({ ...selectedFilterAndSort, sort: value as "Asc" | "Desc" });
                                                setOpenFilters(false);
                                            } else {
                                                setSelectedFilterAndSort({ ...selectedFilterAndSort, filter: value as "Posts" | "Scrolls" });
                                                setOpenFilters(false);
                                            }
                                        }}
                                    >
                                        {option.options.map((opt) => (
                                            <FormControlLabel
                                                key={opt.label}
                                                control={<Radio />}
                                                label={opt.label}
                                                value={opt.value}
                                            />
                                        ))}
                                    </RadioGroup>
                                </Box>
                            ))}

                            {/* <Box mb={3}>
                                <Typography variant="h6">Media</Typography>
                            </Box> */}
                        </div>
                    </DialogContent>
                </Dialog>}

            {/* create post modal */}
            {openCreateContentModal &&
                <Dialog
                    open={openCreateContentModal}
                    onClose={() => setOpenCreateContentModal(false)}
                >
                    <DialogContent>
                        <SubmitBtn
                            cta="Create Post"
                            color="primary"
                            varient="outlined"
                            size="medium"
                            hoverColor="white"
                            needBorder
                            classname="p-5 text-green-600 items-center hover:bg-white"
                            handlclick={() => navigate(`/specter/create/post?GroupId=${topic?.groupId}&TopicId=${topic?.id}`, { state: { props: { topic } } })}
                            style={{
                                borderColor: "green",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                color: "green",
                                width: "100%",
                                marginBottom: "16px",
                                borderRadius: "1rem",
                                height: "49px",
                            }}
                        />

                        <SubmitBtn
                            cta="Create Scroll"
                            color="primary"
                            hoverColor="white"
                            varient="outlined"
                            needBorder
                            size="medium"
                            classname="p-5 text-red-600 items-center hover:bg-white"
                            handlclick={() => navigate(`/specter/create/scroll?GroupId=${topic?.groupId}&TopicId=${topic?.id}`, { state: { props: { topic } } })}
                            style={{
                                borderColor: "red",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                color: "red",
                                width: "100%",
                                borderRadius: "1rem",
                                height: "49px",
                            }}
                        />
                    </DialogContent>
                </Dialog>}
        </div>
    );
}

export default TopicsArea;
