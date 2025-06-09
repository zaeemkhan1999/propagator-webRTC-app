import { useState, useEffect, useRef, useMemo } from 'react';
import { Avatar, Box, Typography, List, ListItem, ListItemAvatar, ListItemText, CircularProgress } from '@mui/material';
import SearchBar from '../../Explore/Components/SearchBar';
import { useNavigate } from 'react-router';
import { useSnapshot } from 'valtio';
import { userStore } from '../../../../store/user';
import { DaysAgo } from '../../../utility/misc.helpers';
import Lottie from 'lottie-react';
import NoData from "../../../utility/Nodata.json";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useGetUsers } from '../../Admin/queries/getUsers';
import ArrowLeft from '@/assets/icons/ArrowLeft';

const AllUsers = () => {
    const navigate = useNavigate();
    const user = useSnapshot(userStore.store)?.user;

    const lastUserRef = useRef<HTMLDivElement | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');

    const { data, isLoading, isFetching, isError, error, fetchNextPage, hasNextPage, refetch } = useGetUsers({ searchTerm, ofTypes: ['USER', 'ADMIN', 'SUPER_ADMIN'], excludeUserIds: [user?.id] });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetching) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        if (lastUserRef.current) {
            observer.observe(lastUserRef.current);
        }

        return () => {
            if (lastUserRef.current) {
                observer.unobserve(lastUserRef.current);
            }
        };
    }, [hasNextPage, isFetching, fetchNextPage]);

    return (
        <Box sx={{ overflowY: 'auto', height: '100dvh', p: 2 }}>
            <div className='flex items-center gap-2 mb-5'>
                <ArrowLeft onClick={() => navigate(-1)} className='text-gray-500' />
                <Typography className='text-md text-center'>{user?.displayName || ''}</Typography>
            </div>

            <div className='h-14 sticky top-0 z-50'>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} cb={refetch} />
            </div>

            <List className='pb-5'>
                {isError && <Typography variant="body2" color="error">{error.message}</Typography>}
                <Typography className='text-lg p-2'>All Users</Typography>

                {isLoading
                    ? <div className='text-center'><CircularProgress /></div>
                    : data?.pages.flatMap(page => (
                        page.user_getUsers.result.items.length
                            ? page.user_getUsers.result.items.map(u => (
                                <ListItem
                                    key={u?.id}
                                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, cursor: 'pointer' }}
                                    onClick={() => navigate(`/specter/inbox/chat/${u?.username}`, {
                                        state: {
                                            props: {
                                                otherUsername: u.username,
                                                otherUserId: u.id,
                                                otherUserImage: u.imageAddress || '',
                                                otherUserLastSeen: u.lastSeen || "",
                                                conversationId: 0,
                                                currentUserId: user?.id
                                            }
                                        }
                                    })}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            aria-label="recipe"
                                            className={`border ${!u.imageAddress && "bg-gray-200 text-black text-sm"}`}
                                        >
                                            {u.imageAddress ? (
                                                <LazyLoadImage src={u?.imageAddress} />
                                            ) : (
                                                <p className='uppercase'>{u.displayName.slice(0, 1)}</p>
                                            )}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={u.displayName} secondary={u.username} />
                                    <Typography variant="caption" color="text.secondary">
                                        <p>Last seen</p>
                                        <p>{DaysAgo(u.lastSeen)}</p>
                                    </Typography>
                                </ListItem>
                            ))
                            : <>
                                <Lottie loop={false} animationData={NoData} style={{ width: "200px", height: "200px", margin: "0 auto" }} />
                                <Typography className='text-md text-center italic'>
                                    No user(s) found!
                                </Typography>
                            </>
                    ))}

                {isFetching && hasNextPage && <div className='text-center'><CircularProgress /></div>}
                <div ref={lastUserRef}></div>
            </List>
        </Box>
    );
};

export default AllUsers;
