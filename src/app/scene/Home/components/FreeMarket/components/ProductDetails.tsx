import useGetProductDetails, { ProdDetail, Review } from '@/app/scene/Home/components/FreeMarket/queries/getProductDetails';
import Header from '@/components/Header';
import { Slice } from '@/helper';
import {
    Button,
    Card,
    CardContent,
    Typography,
    Divider,
    Rating,
    CircularProgress,
} from '@mui/material';
import { lazy, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import AddReviewModal from './AddReviewModal';
import { userStore } from '@/store/user';
import { useSnapshot } from 'valtio';
import { DaysAgo } from '@/app/utility/misc.helpers';

const UserAvatar = lazy(() => import('@/components/Stories/components/UserAvatar'));
const CreateProductPage = lazy(() => import('@/app/scene/Create/components/CreateProduct'));

const ProductDetails = () => {
    const user = useSnapshot(userStore.store).user;
    const navigate = useNavigate();

    const { productId } = useParams();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [editProductData, setEditProductData] = useState<null | ProdDetail>(null);

    const { loading, data, getDetails, setData } = useGetProductDetails();

    const goToMarket = () => navigate('/specter/free-market');

    useEffect(() => {
        (productId)
            ? getDetails({ id: +productId })
            : goToMarket();
    }, [productId]);

    const handleContactSeller = () => {
        user?.id === data?.seller?.id
            ? setEditProductData(data)
            : navigate(`/specter/inbox/chat/${data?.seller?.username}`, {
                state: {
                    props: {
                        otherUsername: data?.seller?.username,
                        otherUserId: data?.seller?.id,
                        otherUserImage: data?.seller?.imageAddress,
                        otherUserLastSeen: "",
                        conversationId: 0,
                        currentUserId: user?.id,
                    },
                },
            });
    };

    const handleViewProfile = () => {
        navigate(`/specter/${user?.id === data?.seller?.id ? 'profile?Tab=Market' : `userProfile/${data?.seller?.id}?Tab=Market`}`);
    };

    const onAddReview = (review: Review) => {
        review && data && setData(prev => prev ? ({ ...prev, productReview: { ...prev.productReview, totalReviews: prev.productReview?.totalReviews + 1 }, reviews: [...prev.reviews, review] }) : prev);
    };

    const onEdit = () => {
        setEditProductData(null);
        productId && getDetails({ id: +productId });
    };

    return (!editProductData
        ? loading
            ? <div className='h-dvh w-full flex items-center justify-center !bg-[#0a0a0a] text-white'><CircularProgress /></div>
            : data
                ? <div className="px-2 h-dvh overflow-y-auto !bg-[#0a0a0a] text-white">
                    <Header
                        handleBack={goToMarket}
                        text={Slice(data?.name, 20)}
                    />
                    <Card className="flex pt-4 flex-col md:flex-row !bg-[#0a0a0a] text-white">
                        <Card className="w-full max-w-md mx-auto">
                            <Swiper pagination modules={[Pagination]} className="w-full rounded-lg">
                                {data?.images?.length
                                    ? data?.images.map((img, i) => (
                                        <SwiperSlide key={i} className="flex justify-center">
                                            <img src={img?.url} alt={`Product ${i + 1}`} className="w-full object-contain max-h-[300px] rounded-lg" />
                                        </SwiperSlide>
                                    )) : (
                                        <SwiperSlide>
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                                                alt="No Image"
                                                className="w-full object-contain max-h-[300px] rounded-lg"
                                            />
                                        </SwiperSlide>
                                    )}
                            </Swiper>
                        </Card>
                        <CardContent className="flex-1">
                            <Typography variant="h6" className="font-semibold mb-2" style={{ fontSize: '16px' }}>
                                {data?.name}
                            </Typography>

                            <div className='flex justify-between items-center'>
                                <Typography className="font-bold" style={{ fontSize: '16px' }}>
                                    {data?.currency.toUpperCase()} {data?.price.toLocaleString()}
                                </Typography>
                                <Typography className="font-bold text-green-700" style={{ fontSize: '16px' }}>
                                    {data?.stock.toLocaleString() || 0} available
                                </Typography>
                                <div className='flex items-center'>
                                    <Rating name="read-only" value={data?.productReview?.averageRating || 0} readOnly size="medium" /> <span>({data?.productReview?.totalReviews || 0})</span>
                                </div>
                            </div>

                            <Divider className="my-4" color='gray' />

                            <Button
                                variant="contained"
                                color="warning"
                                className="w-full mt-2 !bg-green-400 !border-none hover:bg-yellow-500 !text-white !rounded-full transition-all duration-300 text-wi"
                                onClick={handleContactSeller}
                            >
                                {user?.id === data?.seller?.id ? "Edit Product" : "Contact Seller"}
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                className="w-full mt-2 !border-none hover:bg-yellow-500 !text-white !rounded-full transition-all duration-300 text-wi"
                                onClick={handleViewProfile}
                            >
                                View {user?.id === data?.seller?.id ? "Profile" : "Seller's Profile"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Typography variant="h6" className="font-semibold " style={{ fontSize: '16px' }}>
                        Product Description
                    </Typography>
                    <p style={{ fontSize: '12px' }}>
                        {data?.description}
                    </p>

                    <div className="mt-6">
                        <div className='flex items-center justify-between mb-3'>
                            <Typography variant="h6" className="font-semibold " style={{ fontSize: '16px' }}>
                                Reviews ({data?.reviews?.length || 0})
                            </Typography>

                            <Button onClick={() => setShowReviewModal(true)} variant="contained" color="info" className="w-fit !text-xs mt-2 !border-none hover:bg-yellow-500 !text-white !rounded-full transition-all duration-300" style={{ fontSize: '14px' }}>Add Review</Button>
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            {data?.reviews?.length
                                ? data?.reviews.map(r => (
                                    <div key={r?.id} className='border border-gray-500 rounded-xl p-3'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex gap-2 items-center mb-2'>
                                                <UserAvatar
                                                    user={r?.user}
                                                    size='6'
                                                    isSelf={r?.user?.id === user?.id}
                                                />
                                                <p onClick={() => navigate(`/specter/${r?.user?.id === user?.id ? 'profile' : `userProfile/${r?.user?.id}`}`)}>{r?.user?.username || 'User'}</p>
                                            </div>
                                            <p className='italic text-xs'>{DaysAgo(r?.createdDate)}</p>
                                        </div>
                                        <Divider className="my-2" color='gray' />
                                        <div>
                                            <Rating name="read-only" value={r?.rating} readOnly size="medium" />
                                            <Typography className="font-semibold" style={{ fontSize: '14px' }}>
                                                {r?.description}
                                            </Typography>
                                        </div>
                                    </div>
                                ))
                                : <p className='italic text-center'>No review yet!</p>}
                        </div>
                    </div>

                    {showReviewModal &&
                        <AddReviewModal
                            open={showReviewModal}
                            handleClose={() => setShowReviewModal(false)}
                            productId={productId}
                            userId={user?.id}
                            onAddReview={onAddReview}
                        />}
                </div>
                : <div className='h-dvh w-full flex items-center justify-center !bg-[#0a0a0a] text-white italic'>Unable to get Product Details</div>
        : <CreateProductPage
            editProductData={editProductData}
            setEditProductData={setEditProductData}
            onEditProduct={onEdit}
        />
    );
};

export default ProductDetails;
