import { memo, useEffect, useState, lazy } from 'react';
import { useGetStoriesByUserId } from '../queries/getStoriesByUserId';
import { Avatar } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const StoryViewer = lazy(() => import('./StoryViewer'));

interface Props {
    user: {
        id?: number;
        imageAddress?: string;
        username?: string;
    };
    size?: string;
    isSelf: boolean;
};

const UserAvatar = memo(({ user, size, isSelf }: Props) => {

    const [openViewer, setOpenViewer] = useState(false);

    const { data, setData, getData, isLoading, isFetched } = useGetStoriesByUserId();

    const handleClick = () => {
        !isLoading && user.id && getData(user.id);
    };

    useEffect(() => {
        data.length && isFetched && !isLoading && setOpenViewer(true);
    }, [data, isFetched, isLoading]);

    const closeViewer = () => {
        setOpenViewer(false);
    };

    return (
        <div className='cursor-pointer' title={`View ${user?.username}'s Story`}>

            <Avatar
                onClick={handleClick}
                aria-label="recipe"
                className={`border ${isLoading ? "border-green-500 border-[2px]" : "border-gray-200"} dark:border-gray-800 relative ${!user?.imageAddress && "bg-gray-200 text-black dark:bg-gray-600 dark:text-white"} h-${size ?? "14"} w-${size ?? "14"}`}
            >
                {user?.imageAddress
                    ? <LazyLoadImage
                        width="100%"
                        height="100%"
                        className="h-full w-full object-cover"
                        src={user?.imageAddress}
                        alt={user?.username + "'s Profile Image"}
                    />
                    : <p className='uppercase text-xl'>{user?.username?.slice(0, 1)}</p>}
            </Avatar>

            {openViewer &&
                <StoryViewer
                    isOpen={openViewer}
                    onClose={closeViewer}
                    isMyStories={isSelf}
                    stories={data}
                    setStories={setData}
                    user={user}
                />}
        </div>
    );
});

export default UserAvatar;
