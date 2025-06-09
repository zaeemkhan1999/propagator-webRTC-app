import { memo } from "react";
import { Card, CardContent, CardMedia, Typography, Rating } from "@mui/material";
import { Product } from "../queries/getProducts";
import { Slice } from "@/helper";
import { useNavigate } from "react-router-dom";

interface ProductCarousalProps {
    products: Product[];
};

const ProductCarousal = memo(({ products }: ProductCarousalProps) => {

    const navigate = useNavigate();

    return (
        <div className="w-full overflow-x-auto scrollbar-hide text-center">
            <div className="flex space-x-4">
                {products?.map((p) => (
                    <Card key={p.id} className="bg-[#0f0f0f] !text-white min-w-[180px] max-h-[250px]  rounded-xl p-2 transition-shadow duration-300 flex flex-col" onClick={() => navigate(`/specter/free-market/product/${p?.id}`)}>
                        <CardMedia
                            component="img"
                            image={p?.images[0]?.url || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                            alt={p.name}
                            height={"100%"}
                            className="object-cover h-[150px] md:max-h-auto w-full rounded-lg border border-gray-500"
                        />
                        <CardContent className='p-0 mt-2'>
                            <Typography variant="h6" className="font-semibold text-xs">
                                {Slice(p.name, 20)}
                            </Typography>
                            <Typography variant="body1" className='text-xs'>
                                {p.currency.toUpperCase()} {p.price.toLocaleString()}
                            </Typography>
                            <div className="flex gap-1 items-center justify-center">
                                <Rating size='small' name="Rating" value={p?.productReview?.averageRating || 0} readOnly color="grey" />
                                <Typography className="font-semibold mr-1  !text-xs">({p?.productReview?.totalReviews || 0})</Typography>
                            </div>

                            <Typography className="text-sm">By: {p?.seller?.username}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
});

export default ProductCarousal;
