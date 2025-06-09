import { useState, useEffect, lazy, useRef } from 'react';
import { AdminUser, useGetUsers } from '../queries/getUsers';
import { Avatar, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import NoData from "../../../utility/Nodata.json";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import SearchBar from '../../Explore/Components/SearchBar';
import { useBanUser } from '../mutations/banUnbanUsers';
import ArrowLeft from '@/assets/icons/ArrowLeft';
import DotsVertical from '@/assets/icons/DotsMenu';
import UserCheck from '@/assets/icons/UserCheck';

const BottomSheet = lazy(() => import('../../../../components/BottomSheet/BottomSheet'));

const BannedUsers = () => {
    const navigate = useNavigate();
    const lastUserRef = useRef<null | HTMLDivElement>(null);

    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<AdminUser | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading, refetch } = useGetUsers({
        searchTerm,
        ofTypes: ["USER"],
        isActive: false,
    });

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

    const { banUnbanUser, loading } = useBanUser();

    const handleUnbanUser = (userId?: string | number) => {
        !loading && userId && banUnbanUser({ userId: Number(userId), isActive: true }, () => {
            refetch();
            setIsBottomSheetOpen(null);
        });
    }

    return (
        <div className='h-screen pb-10 overflow-y-auto pt-3 px-3'>
            <div className='flex gap-5 items-center mb-3'>
                <ArrowLeft className='text-black' onClick={() => navigate(-1)} />
                <Typography variant='subtitle1'>
                    Banned Users
                </Typography>
            </div>

            <div className='sticky top-0 z-50'>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} cb={refetch} />
            </div>

            <div>
                {isLoading
                    ? <div className='text-center'><CircularProgress /></div>
                    : error
                        ? <Typography variant="body1" className="text-center italic mt-10">
                            Some error occured while getting Banned Users!
                        </Typography>
                        : data?.pages.flatMap(page => (
                            page.user_getUsers.result.items.length
                                ? page.user_getUsers.result.items.map(u => (
                                    <div key={u.id} className='flex justify-between my-3 items-center bg-gray-100 p-3 rounded-2xl'>
                                        <div className='flex gap-3 items-center'>
                                            <Avatar
                                                aria-label="recipe"
                                                className={`border ${!u?.imageAddress && "bg-gray-200 text-black text-sm"}`}
                                            >
                                                {u?.imageAddress
                                                    ? <LazyLoadImage src={u?.imageAddress} />
                                                    : <p className='uppercase'>{u?.displayName?.slice(0, 1)}</p>}
                                            </Avatar>

                                            <Typography variant='body1' onClick={() => navigate('/specter/userProfile/' + u.id)}>
                                                {u.displayName}  <span className='italic'>({u.username})</span>
                                            </Typography>
                                        </div>

                                        <DotsVertical onClick={() => setIsBottomSheetOpen(u)} className='cursor-pointer' />
                                    </div>))
                                : <>
                                    <Lottie loop animationData={NoData} style={{ width: "200px", height: "200px", margin: "0 auto" }} />
                                    <Typography className='text-md text-center italic'>
                                        No Banned User(s) found!
                                    </Typography>
                                </>
                        ))}
                <div ref={lastUserRef}></div>
                {isFetching && !isLoading && <div className='text-center'><CircularProgress /></div>}
            </div>

            <BottomSheet isOpen={!!isBottomSheetOpen && !isFetching} onClose={() => setIsBottomSheetOpen(null)} maxW="md">
                <div className='flex flex-col gap-3 pb-10'>
                    <div className='flex gap-3 p-3 text-green-900' onClick={() => handleUnbanUser(isBottomSheetOpen?.id)}>
                        <UserCheck />
                        {loading
                            ? <div className='text-center'><CircularProgress /></div>
                            : <Typography variant='body1'>
                                Unban <span className='italic'>{isBottomSheetOpen?.username}</span>
                            </Typography>}
                    </div>
                </div>
            </BottomSheet>
        </div>
    );
}

export default BannedUsers;
