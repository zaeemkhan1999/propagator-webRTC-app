const HeartFilled = (props: any) => {
    return (
        <svg {...props}
            xmlns="http://www.w3.org/2000/svg"
            width={props?.size ?? "24"}
            height={props?.size ?? "24"}
            viewBox="0 0 256 256"
            fill={props?.color || "currentColor"}>
            <path
                fill={props?.color || 'currentColor'}
                d="M240 102c0 70-103.79 126.66-108.21 129a8 8 0 0 1-7.58 0C119.79 228.66 16 172 16 102a62.07 62.07 0 0 1 62-62c20.65 0 38.73 8.88 50 23.89C139.27 48.88 157.35 40 178 40a62.07 62.07 0 0 1 62 62"
            />
        </svg>
    )
}

export default HeartFilled