import { lazy, useEffect, useRef, useState } from 'react';
import { AdminUser, useGetUsers } from '../queries/getUsers';
import { useSnapshot } from 'valtio';
import { userStore } from '@/store/user';
import { Avatar, CircularProgress, Typography } from '@mui/material';
import SearchBar from '../../Explore/Components/SearchBar';
import Lottie from 'lottie-react';
import NoData from "../../../utility/Nodata.json";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ArrowLeft from '@/assets/icons/ArrowLeft';
import { useNavigate } from 'react-router';
import { useSetAsAdministrator } from '../mutations/grantOrRevokeAdminAccess';
import DotsVertical from '@/assets/icons/DotsMenu';
import UserDown from '@/assets/icons/UserDown';
import UserEdit from '@/assets/icons/UserEdit';

const BottomSheet = lazy(() => import("@/components/BottomSheet/BottomSheet"));

const Admins = () => {
    const navigate = useNavigate();
    const lastAdminRef = useRef<null | HTMLDivElement>(null);

    const user = useSnapshot(userStore.store).user;

    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<AdminUser | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const { data, isFetching, isLoading, refetch, fetchNextPage, hasNextPage } = useGetUsers({ searchTerm, excludeUserIds: [user?.id!], ofTypes: ["ADMIN"] });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetching) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        if (lastAdminRef.current) {
            observer.observe(lastAdminRef.current);
        }

        return () => {
            if (lastAdminRef.current) {
                observer.unobserve(lastAdminRef.current);
            }
        };
    }, [hasNextPage, isFetching, fetchNextPage]);

    const { grantOrRevokeAdminAccess, loading } = useSetAsAdministrator();

    const handleRevokeAdminAccess = (userId?: string | number) => {
        !loading && userId && grantOrRevokeAdminAccess({ userId: Number(userId), userTypes: "USER" }, () => {
            refetch();
            setIsBottomSheetOpen(null);
        });
    }

    return (
        <div className='h-screen p-3'>
            <div className='flex gap-5 items-center mb-3'>
                <ArrowLeft className='text-black' onClick={() => navigate(-1)} />
                <Typography variant='subtitle1'>
                    Admins
                </Typography>
            </div>

            <div className='sticky top-0 z-50'>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} cb={refetch} />
            </div>

            <div className='my-5'>
                {isLoading
                    ? <div className='text-center'><CircularProgress /></div>
                    : data?.pages.flatMap(page => (
                        page.user_getUsers.result.items.length
                            ? page.user_getUsers.result.items.map(a => (
                                <div key={a.id} className='flex justify-between my-3 items-center'>
                                    <div className='flex gap-3 items-center'>
                                        <Avatar
                                            aria-label="recipe"
                                            className={`border ${!a?.imageAddress && "bg-gray-200 text-black text-sm"}`}
                                        >
                                            {a?.imageAddress
                                                ? <LazyLoadImage src={a?.imageAddress} />
                                                : <p className='uppercase'>{a?.username?.slice(0, 1)}</p>}
                                        </Avatar>

                                        <Typography variant='body1' onClick={() => navigate('/specter/userProfile/' + a.id)}>
                                            {a.username}
                                        </Typography>
                                    </div>

                                    <DotsVertical onClick={() => setIsBottomSheetOpen(a)} className='cursor-pointer' />
                                </div>
                            ))
                            : <>
                                <Lottie loop animationData={NoData} style={{ width: "200px", height: "200px", margin: "0 auto" }} />
                                <Typography className='text-md text-center italic'>
                                    No Admin(s) found!
                                </Typography>
                            </>
                    ))}
                <div ref={lastAdminRef}></div>
                {isFetching && !isLoading && <div className='text-center'><CircularProgress /></div>}
            </div>

            <BottomSheet isOpen={!!isBottomSheetOpen && !isFetching} onClose={() => setIsBottomSheetOpen(null)} maxW="md">
                <div className='flex flex-col gap-3 pb-10'>
                    <div className='flex gap-3 p-3' onClick={() => navigate(`permissions/${isBottomSheetOpen?.username}`)}>
                        <UserEdit />
                        <Typography variant='body1'>
                            Permissions
                        </Typography>
                    </div>
                    <div className='flex gap-3 p-3 text-red-900' onClick={() => handleRevokeAdminAccess(isBottomSheetOpen?.id)}>
                        <UserDown />
                        {loading
                            ? <div className='text-center'><CircularProgress /></div>
                            : <Typography variant='body1'>
                                Revoke Admin Access (from <span className='italic'>{isBottomSheetOpen?.username}</span>)
                            </Typography>}
                    </div>
                </div>
            </BottomSheet>
        </div>
    );
}

export default Admins;
