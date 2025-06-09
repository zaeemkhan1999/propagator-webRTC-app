import { useEffect, useState } from 'react';
import { IconArrowLeft, IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/app/scene/Explore/Components/SearchBar';
import useGetAllProducts from '@/app/scene/Home/components/FreeMarket/queries/getProducts';
import { useInView } from 'react-intersection-observer';
import ProductCards from './components/ProductCards';
import ProductCarousal from './components/ProductCarousal';
import { IconButton } from '@mui/material';

interface Props {
    needTopPadding?: boolean;
};

const FreeMarket = ({ needTopPadding }: Props) => {
    const navigate = useNavigate();

    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const { data: products,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isLoading } = useGetAllProducts(undefined, searchTerm);

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
        <div id='container' className={`p-2 h-dvh space-y-2 overflow-y-auto bg-[#0a0a0a] text-white ${needTopPadding ? "pt-10" : ""}`}>
            <div className='flex items-center justify-between mb-5'>
                {needTopPadding ?
                    <div></div>
                    : <IconArrowLeft className='sticky top-0 z-50' onClick={() => navigate('/specter/home')} />}
                <h1 className={`font-bold text-xl ${needTopPadding ? 'pl-9' : ''}`}>The Free Market</h1>
                <IconButton onClick={() => setShowSearch(prev => !prev)}><IconSearch color="white" size={24} /></IconButton>
            </div>

            {showSearch &&
                <SearchBar
                    className="m-auto !my-4 h-10 w-full text-[14px] md:my-4 md:h-14 md:w-[75%]"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    cb={refetch}
                />}

            <ProductCarousal
                products={products || []} />

            <ProductCards
                products={products || []}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                lastProductRef={ref}
            />
        </div>
    );
};

export default FreeMarket;
