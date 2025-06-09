import { memo } from "react";
import { Slice } from "@/helper";
import { Card, CardContent, CardMedia, CircularProgress, Rating, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Product } from "../queries/getProducts";

interface ProductCardsProps {
    products: Product[];
    isLoading?: boolean;
    isFetchingNextPage?: boolean;
    lastProductRef: any;
};

const ProductCards = memo(({ products, isLoading, isFetchingNextPage, lastProductRef }: ProductCardsProps) => {

    const navigate = useNavigate();

    return (
        isLoading
            ? <div className='w-full text-center text-white h-screen'><CircularProgress /></div>
            : <>
                {products?.length
                    ? products?.map(p =>
                        <Card key={p?.id} className="w-full min-h-[180px] max-h-[200px] md:w-2/3 mt-4 mx-auto p-2 rounded-xl bg-[#0f0f0f] !text-white overflow-hidden flex justify-between items-center" onClick={() => navigate(`/specter/free-market/product/${p?.id}`)}>
                            <CardMedia
                                component="img"
                                image={p?.images[0]?.url || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                                alt={p?.name}
                                height={"100%"}
                                className="object-cover max-w-[160px] h-[150px] md:max-h-auto w-full md:w-1/3 rounded-xl border border-gray-500"
                            />
                            <CardContent className="flex-1 space-y-1 p-2">
                                <Typography variant="body1" className="font-semibold">
                                    {Slice(p?.name, 60)}
                                </Typography>
                                <div className="flex gap-1 items-center !text-xs">
                                    <Rating size='small' name="Rating" value={p?.productReview?.averageRating || 0} readOnly />
                                    <Typography className="font-semibold mr-1  !text-xs">({p?.productReview?.totalReviews || 0})</Typography>
                                </div>
                                <Typography className="text-md font-bold">
                                    {p.currency.toUpperCase()} {p.price.toLocaleString()}
                                </Typography>

                                <Typography className="text-sm">By: {p?.seller?.username}</Typography>
                            </CardContent>
                        </Card>
                    )
                    : <p className="italic text-center h-screen">No product found!</p>}

                {isFetchingNextPage && <div className='w-full text-center'><CircularProgress /></div>}
                <div ref={lastProductRef}></div>
            </>
    );
});

export default ProductCards;
