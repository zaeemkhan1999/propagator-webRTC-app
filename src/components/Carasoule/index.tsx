import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { isVideo } from '../../app/utility/misc.helpers';

interface ImageSwiperProps {
  images: string[];
}

const ImageSwiper: React.FC<ImageSwiperProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const handleSlideChange = (swiper: any) => {
    setCurrentSlide(swiper.realIndex);
  };

  return (
    <div className='w-full h-full relative'>
      <Swiper
        modules={[Pagination]}
        className='mySwiper'
        navigation={true}
        pagination={{ clickable: true }}
        loop
        onSlideChange={handleSlideChange}
      >
        {images.map((content, index) => {
          return (
            <SwiperSlide key={index}>
              {
                isVideo(content) ?
                  <video
                    src={content}
                    className='rounded-xl border border-gray-400'
                    playsInline
                    autoPlay
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: "block" }}
                  />
                  :
                  <img
                    src={content}
                    alt={`Slide ${index}`}
                    className='rounded-xl border border-gray-400'
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: "block" }}
                  />
              }

            </SwiperSlide>
          )
        })}
      </Swiper>
      <div
        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white font-normal text-base"
        style={{ zIndex: 10 }}
      >
        {currentSlide + 1}/{images.length}
      </div>
    </div>
  );
};

export default ImageSwiper;
