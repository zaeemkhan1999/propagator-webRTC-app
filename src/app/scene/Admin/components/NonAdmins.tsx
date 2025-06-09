import { useState, useEffect, lazy, useRef } from 'react';
import { AdminUser, useGetUsers } from '../queries/getUsers';
import { Avatar, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import NoData from "../../../utility/Nodata.json";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSetAsAdministrator } from '../mutations/grantOrRevokeAdminAccess';
import SearchBar from '../../Explore/Components/SearchBar';
import { useBanUser } from '../mutations/banUnbanUsers';
import UserOff from '@/assets/icons/IconUserOff';
import ArrowLeft from '@/assets/icons/ArrowLeft';
import DotsVertical from '@/assets/icons/DotsMenu';
import UserCheck from '@/assets/icons/UserCheck';

const BottomSheet = lazy(() => import('../../../../components/BottomSheet/BottomSheet'));

const NonAdmins = () => {
    const navigate = useNavigate();
    const lastUserRef = useRef<null | HTMLDivElement>(null);

    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<AdminUser | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetching, refetch } = useGetUsers({
        searchTerm,
        ofTypes: ["USER"]
    });

    const handleClose = () => {
        refetch();
        setIsBottomSheetOpen(null);
    }

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

    const { grantOrRevokeAdminAccess, loading } = useSetAsAdministrator();

    const handleGrantAdminAccess = (userId?: string | number) => {
        !loading && userId && grantOrRevokeAdminAccess({ userId: Number(userId), userTypes: "ADMIN" }, handleClose);
    }

    const { banUnbanUser, loading: banningUser } = useBanUser();

    const handleBanUser = () => {
        isBottomSheetOpen?.id && banUnbanUser({ userId: Number(isBottomSheetOpen.id), isActive: false }, handleClose);
    }

    return (
        <div className='h-screen pb-10 overflow-y-auto pt-3 px-3'>
            <div className='flex gap-5 items-center mb-3'>
                <ArrowLeft className='text-black' onClick={() => navigate(-1)} />
                <Typography variant='subtitle1'>
                    Non-Admin Users
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
                            Some error occured while getting users!
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
                                    </div>
                                ))
                                : <>
                                    <Lottie loop animationData={NoData} style={{ width: "200px", height: "200px", margin: "0 auto" }} />
                                    <Typography className='text-md text-center italic'>
                                        No Non-Admin User(s) found!
                                    </Typography>
                                </>
                        ))}
                <div ref={lastUserRef}></div>
                {isFetching && !isLoading && <div className='text-center'><CircularProgress /></div>}
            </div>

            <BottomSheet isOpen={!!isBottomSheetOpen && !isFetching} onClose={() => setIsBottomSheetOpen(null)} maxW="md">
                <div className='flex flex-col gap-3 pb-10'>
                    <div className='flex gap-3 p-3 text-green-900' onClick={() => handleGrantAdminAccess(isBottomSheetOpen?.id)}>
                        <UserCheck />
                        {loading
                            ? <div className='text-center'><CircularProgress /></div>
                            : <Typography variant='body1'>
                                Grant Admin Access (to <span className='italic'>{isBottomSheetOpen?.username}</span>)
                            </Typography>}
                    </div>
                    {banningUser
                        ? <div className="text-center"><CircularProgress /></div>
                        : <div onClick={handleBanUser} className={`px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center text-red-900`}>
                            <UserOff className="mr-2 inline" size={24} />
                            <span className="text-base">Ban <span className='italic'>{isBottomSheetOpen?.username}</span></span>
                        </div>}
                </div>
            </BottomSheet>
        </div>
    );
}

export default NonAdmins;
