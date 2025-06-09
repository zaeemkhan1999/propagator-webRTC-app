import { useState, useEffect, lazy, useRef } from 'react';
import { CircularProgress, Typography, TextField, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import NoData from "../../../utility/Nodata.json";
import { Discount, useGetDiscounts } from '../../Promotions/queries/getDiscountCodes';
import { useRemoveDiscount } from '../../Promotions/mutations/removeDiscount';
import { useUpdateDiscount } from '../../Promotions/mutations/updateDiscount';
import { useCreateDiscount } from '../../Promotions/mutations/createDiscount';
import { formatDateForInput, generalDateFormat } from '@/app/utility/misc.helpers';
import ArrowLeft from '@/assets/icons/ArrowLeft';
import Plus from '@/assets/icons/IconPlus';
import DotsVertical from '@/assets/icons/DotsMenu';
import Edit from '@/assets/icons/IconEdit';
import Trash from '@/assets/icons/IconTrash';

const BottomSheet = lazy(() => import('@/components/BottomSheet/BottomSheet'));
const BasicModal = lazy(() => import('@/components/Modals/BasicModal'));

type ModalData = {
    id: null | number;
    discountCode: string;
    action: string;
    expireDate: string;
    percent: string;
    amount: string;
}

const initialModalData = {
    id: null,
    action: "Add",
    discountCode: "",
    expireDate: "",
    percent: "",
    amount: "",
}

const Discounts = () => {
    const navigate = useNavigate();
    const lastDiscountRef = useRef<null | HTMLDivElement>(null);

    const [isModalOpen, setIsModalOpen] = useState<ModalData | null>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<Discount | null>(null);

    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetching, refetch } = useGetDiscounts({});

    useEffect(() => {
        refetch();
    }, []);

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

        if (lastDiscountRef.current) {
            observer.observe(lastDiscountRef.current);
        }

        return () => {
            if (lastDiscountRef.current) {
                observer.unobserve(lastDiscountRef.current);
            }
        };
    }, [hasNextPage, isFetching, fetchNextPage]);

    const { createDiscount, loading: creatingDiscount } = useCreateDiscount();
    const { updateDiscount, loading: updatingDiscount } = useUpdateDiscount();

    const handleSave = () => {
        if (!creatingDiscount || !updatingDiscount) {
            const { action, id, amount, percent, expireDate, discountCode } = isModalOpen || {};

            if (!!isModalOpen && action === "Add" && amount && percent && expireDate && discountCode) {
                createDiscount({ amount: Number(amount), percent: Number(percent), discountCode, expireDate }, () => {
                    handleClose();
                    setIsModalOpen(null);
                });
            } else if (!!isModalOpen && id && action === "Edit" && amount && percent && expireDate && discountCode) {
                updateDiscount({ id, amount: Number(amount), percent: Number(percent), discountCode, expireDate }, () => {
                    handleClose();
                    setIsModalOpen(null);
                });
            }
        }
    }

    const handleEditClick = () => {
        const { id, amount, discountCode, expireDate, percent } = isBottomSheetOpen || {};
        if (id && amount && discountCode && expireDate && percent) {
            setIsModalOpen({ action: "Edit", ...{ id, amount: String(amount), percent: String(percent), discountCode, expireDate: formatDateForInput(expireDate) } });
            setIsBottomSheetOpen(null);
        }
    }

    const { removeDiscount, loading: removingDiscount } = useRemoveDiscount();

    const handleDelete = () => {
        !removingDiscount && isBottomSheetOpen && removeDiscount({ entityId: isBottomSheetOpen.id },
            () => {
                setIsBottomSheetOpen(null);
                refetch();
            }
        );
    }

    return (
        <div className='h-screen pb-10 overflow-y-auto pt-3 px-3'>
            <div className='flex justify-between items-center mb-3'>
                <div className='flex gap-3 items-center'>
                    <ArrowLeft className='text-black' onClick={() => navigate('/specter/home')} />
                    <Typography variant='subtitle1'>
                        Discounts
                    </Typography>
                </div>
                <button className='flex items-center text-green-600 h-[40px] gap-1 border-[1px] border-green-600 rounded-full px-3 py-1 cursor-pointer' onClick={() => setIsModalOpen(initialModalData)}>
                    <Plus size={20} />
                    <Typography className='text-sm' variant='subtitle1'>
                        Create New
                    </Typography>
                </button>
            </div>

            <div>
                {isLoading
                    ? <div className="mt-4 flex justify-between my-3 items-start p-4  shadow-md rounded-2xl">
                        <div className="flex flex-col gap-3 !text-[14px] font-medium">
                            <p>
                                <Skeleton className='bg-gray-300' variant="text" width={100} height={20} />
                            </p>
                            <p>
                                <Skeleton className='bg-gray-300' variant="text" width={120} height={20} />
                            </p>
                            <p>
                                <Skeleton className='bg-gray-300' variant="text" width={140} height={20} />
                            </p>
                            <p>
                                <Skeleton className='bg-gray-300' variant="text" width={140} height={20} />
                            </p>
                        </div>
                        <Skeleton className='bg-gray-300' variant="circular" width={24} height={24} />
                    </div>
                    : error
                        ? <Typography variant="body1" className="text-center italic mt-10">
                            Some error occured while getting Discounts!
                        </Typography>
                        : data?.pages?.flatMap(page => (
                            page?.discount_getDiscountes?.result?.items?.length
                                ? page?.discount_getDiscountes?.result?.items?.map(d => (
                                    <div key={d.id} className='mt-4 flex justify-between my-3 items-start p-4 bg-white shadow-md rounded-2xl'>
                                        <div className='flex flex-col gap-3 text-gray-800 !text-[14px] font-medium'>
                                            <div className='flex items-center gap-2'>
                                                <strong className='min-w-[70px]'> Code:</strong> <span>{d.discountCode}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <strong className='min-w-[70px]'>Amount:</strong> <span>CAD ${d.amount}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <strong className='min-w-[70px]'>Percent:</strong> <span>{d.percent}%</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <strong className='min-w-[70px]'>Expiry:</strong> <span>{generalDateFormat(d.expireDate)}</span>
                                            </div>
                                        </div>
                                        <DotsVertical onClick={() => setIsBottomSheetOpen(d)} className='cursor-pointer' />
                                    </div>
                                ))
                                : <>
                                    <Lottie loop animationData={NoData} style={{ width: "200px", height: "200px", margin: "0 auto" }} />
                                    <Typography className='text-md text-center italic'>
                                        No Discount(s) found!
                                    </Typography>
                                </>
                        ))}

                <div ref={lastDiscountRef}></div>

                {isFetching && !isLoading && <div className="mt-4 flex justify-between my-3 items-start p-4  shadow-md rounded-2xl">
                    <div className="flex flex-col gap-3 !text-[14px] font-medium">
                        <p>
                            <Skeleton className='bg-gray-300' variant="text" width={100} height={20} />
                        </p>
                        <p>
                            <Skeleton className='bg-gray-300' variant="text" width={120} height={20} />
                        </p>
                        <p>
                            <Skeleton className='bg-gray-300' variant="text" width={140} height={20} />
                        </p>
                        <p>
                            <Skeleton className='bg-gray-300' variant="text" width={140} height={20} />
                        </p>
                    </div>
                    <Skeleton className='bg-gray-300' variant="circular" width={24} height={24} />
                </div>}
            </div>

            <BasicModal open={!!isModalOpen} onClose={() => setIsModalOpen(null)}>
                <div className='p-3 m-3 flex flex-col justify-center items-between space-y-2'>
                    <Typography variant='body1' className='mb-3'>
                        {isModalOpen?.action} Discount
                    </Typography>

                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">
                            Code
                        </label>
                        <input
                            type="text"
                            placeholder="WINTER2024"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            value={isModalOpen?.discountCode}
                            onChange={e => setIsModalOpen(prev => {
                                if (prev) return { ...prev, discountCode: e.target.value }
                                else return prev;
                            })}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">
                            Percentage
                        </label>
                        <input
                            type="number"
                            placeholder="10"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            value={isModalOpen?.percent}
                            onChange={e => setIsModalOpen(prev => {
                                if (prev) return { ...prev, percent: e.target.value }
                                else return prev;
                            })}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">
                            Amount
                        </label>
                        <input
                            type="number"
                            placeholder="100"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            value={isModalOpen?.amount}
                            onChange={e => setIsModalOpen(prev => {
                                if (prev) return { ...prev, amount: e.target.value }
                                else return prev;
                            })}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">
                            Expiry Date
                        </label>
                        <TextField
                            type="date"
                            fullWidth
                            value={isModalOpen?.expireDate}
                            onChange={e => setIsModalOpen(prev => {
                                if (prev) return { ...prev, expireDate: e.target.value }
                                else return prev;
                            })}
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className={`px-4 w-full py-2 bg-red-800 text-white rounded hover:bg-red-500 `}>
                        {(creatingDiscount || updatingDiscount) ? <CircularProgress size={15} /> : "Save"}</button>
                </div>
            </BasicModal>

            <BottomSheet isOpen={!!isBottomSheetOpen && !isFetching} onClose={() => setIsBottomSheetOpen(null)} maxW="md">
                <div className='flex flex-col gap-3 pb-10 cursor-pointer'>
                    <div className='text-yellow flex gap-3 items-center p-3' onClick={handleEditClick}>
                        <Edit />
                        <Typography>
                            Update
                        </Typography>
                    </div>
                    <div className='text-red-700 flex gap-3 items-center p-3' onClick={handleDelete}>
                        <Trash />
                        <Typography>
                            {removingDiscount ? <CircularProgress /> : "Delete"}
                        </Typography>
                    </div>
                </div>
            </BottomSheet>
        </div >
    );
}

export default Discounts;
