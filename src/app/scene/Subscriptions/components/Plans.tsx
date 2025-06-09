import { Box, Typography, Card, Button } from '@mui/material';
import enumsub from '../enum';
import Yellow from '@/assets/images/Yellow.webp'
import Dark from '@/assets/images/Dark.png'
import Red from '@/assets/images/Red.webp'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useState } from 'react';
import RosetteDiscountCheck from '@/assets/icons/IconRosetteDiscountCheck';

interface PlanCardProps {
    item: {
        id: number;
        addedToCouncilGroup: boolean;
        allowDownloadPost: boolean;
        price: number;
        priceId: string;
        removeAds: boolean;
        supportBadge: boolean;
        title: string;
        content: any;
    };
    onClick: (id: string) => void;
    isLoading: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ item, onClick, isLoading }) => {
    const [slicer, setSlicer] = useState(false)
    const visibleMessages = slicer ? item?.content?.features : item?.content?.features?.slice(0, 3);

    return (
        <Card sx={{ marginBottom: 2, minWidth: 350, maxWidth: 350 }} className='shadow-lg border border-[text-gray-100] rounded-[25px]'>
            <Box display="flex" flexDirection="column" alignItems="center" className="relative py-3"  >
                <LazyLoadImage
                    src={
                        enumsub?.Supporters === item?.title
                            ? Yellow
                            : enumsub?.Premium === item?.title
                                ? Dark
                                : Red
                    }
                    style={{ width: '100%', position: "absolute", top: 0, left: 0, zIndex: 0 }}
                    alt={item?.title}
                />
                <Typography className='relative z-2 mt-6 text-white' variant="h6" gutterBottom>
                    {item?.title}
                </Typography>
            </Box>
            <Box display="flex " className="mt-10" justifyContent="center" mt={2} mb={1}>
                <Typography
                    variant="h3"
                    sx={{ textAlign: 'center' }}
                >
                    {'$' + item?.price}
                </Typography>
            </Box>
            <Box display="flex" justifyContent="center" mb={2}>
                <Typography
                    variant="subtitle1"
                    sx={{ textAlign: 'center' }}
                >
                    Per month
                </Typography>
            </Box>
            <Box>
                {visibleMessages?.map((value: any, index: number) => (
                    <Box
                        key={index}
                        display="flex"
                        alignItems="start"
                        gap={1}
                        bgcolor={index % 2 !== 0 ? 'rgba(0,0,0,0.05)' : 'transparent'}
                        p={1}
                    >
                        <div className='text-green-500'>
                            <RosetteDiscountCheck />
                        </div>
                        <Typography
                            variant="body2"
                            className='text-gray-700'
                        >
                            {value}
                        </Typography>
                    </Box>
                ))}
                <p className='px-4 text-[12px] text-red-900 text-end cursor-pointer' onClick={() => setSlicer?.(prev => !prev)}>{slicer ? "Show Less" : "Show More"}</p>
            </Box>
            <Box display="flex" justifyContent="center" my={3}>
                <Button
                    variant="contained"
                    disabled={isLoading}
                    onClick={() => onClick(item.priceId)}
                    sx={{
                        width: "80%",
                        backgroundColor:
                            enumsub?.Supporters === item?.title
                                ? '#b79331'
                                : enumsub?.Premium === item?.title
                                    ? '#002b3b'
                                    : '#9f1a1d',
                        '&:hover': {
                            backgroundColor:
                                enumsub?.Supporters === item?.title
                                    ? '#b79331'
                                    : enumsub?.Premium === item?.title
                                        ? '#002b3b'
                                        : '#9f1a1d',
                        },
                        color: '#fff',
                        border: "none !important",
                        padding: 3
                    }}
                >
                    Select
                </Button>
            </Box>
        </Card >
    );
};

export default PlanCard;