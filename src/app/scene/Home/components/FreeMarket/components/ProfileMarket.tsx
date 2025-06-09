import useGetAllProducts from '@/app/scene/Home/components/FreeMarket/queries/getProducts';
import ProductCarousal from '@/app/scene/Home/components/FreeMarket/components/ProductCarousal';
import ProductCards from '@/app/scene/Home/components/FreeMarket/components/ProductCards';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Divider } from '@mui/material';

interface Props {
    isSelf: boolean
    username: string;
    userId: number;
};

const ProfileMarket = ({ username, userId, isSelf }: Props) => {

    const { data: products,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isLoading } = useGetAllProducts(userId);

    useEffect(() => {
        refetch();
    }, []);

    const { ref } = useInView({
        threshold: 0.1,
        triggerOnce: false,
        onChange: inView => {
            inView && hasNextPage && !isFetchingNextPage && fetchNextPage();
        },
    });

    return (
        <div className="p-2 !bg-[#0a0a0a] text-white">
            <h1 className='pb-1 text-lg text-center'>{isSelf ? 'Your' : `${username}'s`} Products</h1>

            <Divider className="mb-3" color='gray' />

            <ProductCarousal products={products || []} />

            <ProductCards
                products={products || []}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                lastProductRef={ref}
            />
        </div>
    );
};

export default ProfileMarket;
