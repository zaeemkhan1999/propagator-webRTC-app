import BottomSheet from '@/components/BottomSheet/BottomSheet';
import usr from '@/assets/images/avatar.png'
import { memo, useEffect, useState } from 'react';
import SearchBar from '@/app/scene/Explore/Components/SearchBar';
import { userStore } from '@/store/user';
import { enqueueSnackbar } from 'notistack';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Skeleton } from '@mui/material';
import { MessageInput, MessageTypes, useAddDirectMessage } from '@/app/scene/Inbox/mutations/addMessage';
import { useSnapshot } from 'valtio';
import UsersPlus from '@/assets/icons/UsersPlus';
import Done from '@/assets/icons/done';
import Link from '@/assets/icons/Link';
import BrandWhatsapp from '@/assets/icons/Whatsapp';
import BrandFacebook from '@/assets/icons/Facebook';
import BrandTwitter from '@/assets/icons/Twitter';
import useGetUserFollowers from '@/app/scene/UserProfile/queries/getUserFollowers';
import useGetUserFollowings from '@/app/scene/UserProfile/queries/getUserFollowings';
import { useInView } from 'react-intersection-observer';

interface ShareProps {
    showShare: boolean;
    setShowShare: (arg: boolean) => void;
    entityType: MessageTypes;
    entityId: number | undefined;
    text?: string;
    contentAddress?: string;
    buttonName?: string;
    successText?: string;
};

const ShareUIDrawer = memo(({ showShare, setShowShare, entityType, entityId, text, contentAddress, buttonName = 'Share', successText = 'Shared' }: ShareProps) => {
    const u = useSnapshot(userStore.store).user;

    const [searchTerm, setSearchTerm] = useState('')
    const [isCopied, setIsCopied] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    const {
        data: followerData,
        getData: getFollowerData,
        fetchNextPage: fetchNextPageFollower,
        hasNextPage: hasNextPageFollower,
        isFetching: isFetchingFollower,
        isLoading: isLoadingFollower
    } = useGetUserFollowers(u?.id);

    const {
        data: followingData,
        getData: getFollowingData,
        fetchNextPage: fetchNextPageFollowing,
        hasNextPage: hasNextPageFollowing,
        isFetching: isFetchingFollowing,
        isLoading: isLoadingFollowing
    } = useGetUserFollowings(u?.id);

    useEffect(() => {
        if (showShare) {
            getFollowingData();
            getFollowerData();
        };
    }, [showShare]);

    const { ref: lastFollowerRef } = useInView({
        triggerOnce: false,
        threshold: 0.5,
        onChange: inView => {
            if (inView && hasNextPageFollower && !isFetchingFollower && !isLoadingFollower) {
                fetchNextPageFollower();
            };
        },
    });

    const { ref: lastFollowingRef } = useInView({
        triggerOnce: false,
        threshold: 0.5,
        onChange: inView => {
            if (inView && hasNextPageFollowing && !isFetchingFollowing && !isLoadingFollowing) {
                fetchNextPageFollowing();
            };
        },
    });

    const { addMessage } = useAddDirectMessage();

    const handleShare = () => {
        if (selectedUsers.length) {
            selectedUsers.forEach(uId => {
                const msgObj: MessageInput = {
                    messageType: entityType,
                    isShare: false,
                    conversationId: null,
                    parentMessageId: null,
                    text: text || "",
                    receiverId: uId,
                    contentAddress: contentAddress || "",
                    ...(entityType === MessageTypes.POST
                        ? { postId: entityId }
                        : entityType === MessageTypes.STORY
                            ? { storyId: entityId }
                            : {}),
                };
                addMessage({ input: msgObj }, () => {
                    enqueueSnackbar(`${entityType} ${successText}!`, { variant: "success", autoHideDuration: 1000 });
                });
            })
        }
        setSelectedUsers([]);
        setShowShare(false);
    };

    const handleCopyLink = (item: "copy" | "whatsapp") => {
        if (entityId && !isCopied) {
            if (entityType !== MessageTypes.POST) return;

            try {
                const contentLink = `${window.location.origin}/specter/view/post/${entityId}`;
                if (item === "copy") {
                    navigator.clipboard.writeText(contentLink).then(() => {
                        setIsCopied(true);
                        enqueueSnackbar("Link copied", { variant: "info", autoHideDuration: 3000 })
                        setTimeout(() => {
                            setIsCopied(false);
                        }, 2000);
                    });
                } else if (item === "whatsapp") {
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(contentLink)}`;
                    window.open(whatsappUrl, '_blank');
                }
            } catch (error) {
                console.error('Error copying link', error);
            }
        }
    };

    const handleSelectUser = (id: number) => {
        selectedUsers.includes(id)
            ? setSelectedUsers(selectedUsers.filter(u => u !== id))
            : setSelectedUsers([...selectedUsers, id]);
    };

    return (
        <BottomSheet isOpen={showShare} onClose={() => {
            setSelectedUsers([]);
            setShowShare(false);
        }}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white text-black rounded-t-2xl">
                <div className="p-4 flex items-center justify-between gap-3">
                    <SearchBar
                        className='w-full border-[1px] border-gray-200'
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        cb={() => { }} />
                    <UsersPlus />
                </div>
                <h5 className='ml-5 font-bold my-2'>Following</h5>
                <div className="flex items-center gap-4 px-4 overflow-x-auto max-h-[300px]">
                    {isLoadingFollowing && (<LoadingSkeleton />)}

                    {followingData?.map(f => (
                        <div key={f?.followed?.id} className="text-center relative" onClick={() => handleSelectUser(f?.followed?.id)}>
                            <div className='w-20 h-20 rounded-full overflow-hidden mx-auto border-[1px] border-gray-200'>
                                <LazyLoadImage
                                    width={"100%"}
                                    height={"100%"}
                                    src={f.followed.imageAddress || usr}
                                    alt={f.followed.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xs text-center truncate">{f.followed.displayName}</p>

                            {selectedUsers.includes(f.followed.id) && (
                                <div className="absolute top-1 right-1 bg-white rounded-full p-1 text-green-500">
                                    <Done />
                                </div>
                            )}
                        </div>
                    ))}

                    {isFetchingFollowing && <LoadingSkeleton />}
                    <div ref={lastFollowingRef}></div>
                </div>

                <h5 className='ml-5 font-bold my-2'>Followers</h5>
                <div className="flex items-center gap-4 px-4 overflow-x-auto max-h-[200px]">
                    {isLoadingFollower && (<LoadingSkeleton />)}

                    {followerData?.map(f => (
                        <div key={f.follower?.id} className="text-center relative" onClick={() => handleSelectUser(f.follower.id)}>
                            <div className='w-20 h-20 rounded-full overflow-hidden mx-auto border-[1px] border-gray-200'>
                                <LazyLoadImage
                                    width={"100%"}
                                    height={"100%"}
                                    src={f.follower.imageAddress || usr}
                                    alt={f.follower.displayName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xs text-center truncate">{f.follower.displayName}</p>

                            {selectedUsers.includes(f.follower.id) && (
                                <div className="absolute top-1 right-1 bg-white rounded-full p-1 text-green-500">
                                    <Done />
                                </div>
                            )}
                        </div>))}

                    {isFetchingFollower && <LoadingSkeleton />}
                    <div ref={lastFollowerRef}></div>
                </div>

                {!!selectedUsers.length &&
                    <div onClick={handleShare} className='mt-2 flex items-center justify-end w-full  text-white text-center px-3'>
                        <button className='w-fit bg-green-700 py-3 rounded-full px-6'>{buttonName} {selectedUsers.length > 1 ? "seperately" : ""}</button>
                    </div>}

                <div className="flex justify-start mt-3 overflow-x-auto ps-8 pe-4 gap-6 border-t border-gray-300 pt-4 pb-6">
                    <div className="flex flex-col items-center">
                        <div onClick={() => handleCopyLink("whatsapp")} className="rounded-full bg-gray-200 w-14 flex items-center justify-center h-14 p-2">
                            <BrandWhatsapp size={20} className="text-black" />
                        </div>
                        <span className="text-xs mt-1">Whatsapp</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="rounded-full bg-gray-200 w-14 flex items-center justify-center h-14 p-2">
                            <BrandFacebook size={20} className="text-black" />
                        </div>
                        <span className="text-xs mt-1">Facebook</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="rounded-full bg-gray-200 w-14 flex items-center justify-center h-14 p-2">
                            <BrandTwitter size={20} className="text-black" />
                        </div>
                        <span className="text-xs mt-1">Twitter</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div onClick={() => handleCopyLink("copy")} className="rounded-full bg-gray-200 w-14 flex items-center justify-center h-14 p-2">
                            <Link size={20} className="text-black" />
                        </div>
                        <span className="text-xs mt-1">{isCopied ? 'Copied' : 'Copy link'}</span>
                    </div>
                </div>
            </div>
        </BottomSheet>
    );
});

export default ShareUIDrawer;

const LoadingSkeleton = () => {
    return Array(4).fill(null).map((_, index) => (
        <Skeleton
            key={index}
            className="bg-gray-200 min-w-20 h-20"
            variant="circular"
            width="5rem"
            height="5rem"
            animation="wave"
        />
    ));
};
