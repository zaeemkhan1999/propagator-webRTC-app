import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LazyLoadImg = ({
  height,
  src,
  width,
  alt,
  className,
  style,
  onClick,
  placeholderSrc
}: {
  height?: string | number;
  width?: string | number;
  alt: string;
  src: string;
  className?: string;
  placeholderSrc?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) => (
  <LazyLoadImage
    alt={alt}
    height={height}
    src={src}
    placeholderSrc={placeholderSrc}
    width={width}
    effect="blur"
    className={className}
    style={style}
    onClick={onClick}
  />
);

export default LazyLoadImg;
