import { useRef, useState, useEffect, lazy } from 'react';
import { Avatar, CircularProgress } from '@mui/material';
import { userStore } from '@/store/user';
import { StoryTypes } from './mutation/createMyStory';
import { MyStory, useGetMyStories } from './queries/getMyStories';
import { useSnapshot } from 'valtio';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useGetUserStories, UserStory, UserStoryItem } from './queries/getUserStories';
import { useNavigate } from 'react-router';
import { StoryEditorProps } from './components/StoryEditor';
import Plus from '@/assets/icons/IconPlus';

const StoryViewer = lazy(() => import('./components/StoryViewer'));

export interface UserForStory {
    id?: number;
    username?: string;
    displayName?: string;
    imageAddress?: string;
};

const StoriesPage: React.FC = () => {
    const u = useSnapshot(userStore.store).user;
    const navigate = useNavigate();

    const [openStoryDialog, setOpenStoryDialog] = useState<MyStory[] | UserStory[] | null>(null);
    const [user, setUser] = useState<UserForStory>({ id: u?.id, username: u?.username, displayName: u?.displayName, imageAddress: u?.imageAddress });
    const [myStories, setMyStories] = useState<MyStory[] | []>([]);
    const [otherStories, setOtherStories] = useState<UserStoryItem[] | []>([]);
    const [currentUserStoryIndex, setCurrentUserStoryIndex] = useState<null | number>(null);

    const { data: ownStories, isLoading: fetchingOwnStories, refetch: refetchMyStories } = useGetMyStories();
    const { data: otherUserStories, refetch: refetchUserStories } = useGetUserStories();

    useEffect(() => {
        refetchMyStories();
        refetchUserStories();
    }, []);

    useEffect(() => {
        const s = ownStories?.pages?.flatMap(page => page.story_getMyStories.result.items.map(s => s)) || [];
        setMyStories(s);
    }, [ownStories?.pages]);

    useEffect(() => {
        const s = otherUserStories?.pages?.flatMap(page => page.story_getStoryUser.result.items.map(s => s)) || [];
        setOtherStories(s);
    }, [otherUserStories?.pages]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        event.stopPropagation();
        if (files?.length) {
            const fileArray = Array.from(files);
            const state: { props: StoryEditorProps<true> } = {
                props: {
                    isNew: true,
                    story: {
                        contentAddress: fileArray[0],
                        storyType: fileArray[0].type.startsWith("video/") ? StoryTypes.VIDEO : StoryTypes.IMAGE
                    }
                }
            };
            navigate('/specter/story/editor', { state });
        };
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        };
    };

    const handleViewMyStory = () => {
        if (myStories.length) {
            setOpenStoryDialog(myStories);
            setUser({
                id: u?.id,
                username: u?.username,
                displayName: u?.displayName,
                imageAddress: u?.imageAddress,
            });
        }
    };

    const handleViewUserStory = (s: UserStoryItem, i: number) => {
        setCurrentUserStoryIndex(i);
        setOpenStoryDialog(s?.stories);
        s?.stories[0]?.userId !== user?.id &&
            setUser({
                id: s?.stories[0]?.userId,
                username: s?.stories[0]?.user?.username,
                displayName: s?.stories[0]?.user?.displayName,
                imageAddress: s?.stories[0]?.user?.imageAddress,
            });
    };

    const handleViewPrevOrNextUserStory = (handleClose: Function, action: "prev" | "next") => {
        const hasStory = action === "prev"
            ? true
            : (otherStories.length - 1) > (currentUserStoryIndex || 0);

        if (hasStory &&
            (action === "next"
                || (currentUserStoryIndex && currentUserStoryIndex > 0 && action === "prev"))) {
            const newIndex = action === "prev"
                ? (currentUserStoryIndex || 1) - 1
                : (currentUserStoryIndex || 0) + 1;
            handleViewUserStory(otherStories[newIndex], newIndex);
        } else {
            handleClose();
            setCurrentUserStoryIndex(null);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center w-full gap-4 overflow-x-auto scrollbar-hide">
                {/* Add Story / View Story */}
                <div className="flex flex-col items-center relative">
                    <div className="relative w-16 h-16"
                        onClick={handleViewMyStory}
                    >
                        {fetchingOwnStories && (
                            <CircularProgress size={64} thickness={1.8} className="z-20 relative text-green-500" />
                        )}
                        <Avatar
                            aria-label="recipe"
                            className={`w-16 absolute z-1 top-0 left-0 h-16 border-white border ${!u?.imageAddress && 'dark:bg-gray-800 bg-gray-200 text-black dark:text-white text-sm'}`}
                        >
                            {u?.imageAddress ? (
                                <LazyLoadImage width={"100%"} height={"100%"} className='w-full h-full object-cover' src={u?.imageAddress} />
                            ) : (
                                <p className='uppercase'>{u?.username?.slice(0, 1)}</p>
                            )}
                        </Avatar>
                    </div>
                    <p className="text-white text-center text-xs mt-1">{myStories.length ? 'View' : 'Add'} Story</p>
                    <label onClick={e => e.stopPropagation()} className="w-4 h-4 flex items-center justify-center rounded-full absolute bottom-5 right-1 text-[#5A8EBB] bg-white cursor-pointer">
                        <Plus size={14} className='z-50' />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {otherStories.map((s, i) => (
                    <div key={i} className='flex flex-col gap-1 items-center'>
                        <div className="relative w-16 h-16">
                            <Avatar
                                aria-label="recipe"
                                className={`w-16 absolute z-1 top-0 left-0 h-16 border-${s?.stories[s?.stories?.length - 1]?.seenByCurrentUser ? "gray" : "green"}-500 border-[2px] ${!s?.stories[0]?.user?.imageAddress && 'dark:bg-gray-800 bg-gray-200 text-black dark:text-white text-sm'}`}
                                onClick={() => handleViewUserStory(s, i)}
                            >
                                {s?.stories[0]?.user?.imageAddress
                                    ? <LazyLoadImage src={s?.stories[0]?.user?.imageAddress} />
                                    : <p className='uppercase'>{s?.stories[0]?.user?.username?.slice(0, 1)}</p>
                                }
                            </Avatar>
                        </div>
                        <p className="text-white text-center text-xs mt-1">{s?.stories[0]?.user?.username}</p>
                    </div>
                ))}

                {/* Story Viewer */}
                {!!openStoryDialog && (
                    <StoryViewer
                        isOpen={!!openStoryDialog}
                        onClose={() => setOpenStoryDialog(null)}
                        stories={openStoryDialog}
                        setStories={setOpenStoryDialog}
                        refetchStories={user?.id === u?.id ? refetchMyStories : refetchUserStories}
                        isMyStories={user?.id === u?.id}
                        user={user}
                        handleViewPrevOrNextUserStory={handleViewPrevOrNextUserStory}
                    />
                )}
            </div>
        </div>
    );
};

export default StoriesPage;
