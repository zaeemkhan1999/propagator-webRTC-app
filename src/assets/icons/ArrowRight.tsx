const ArrowNarrowRightIcon = (props: any) => {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width={props?.size ?? "24"}
            height={props?.size ?? "24"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M7 12h14" />
            <path d="M14 19l7 -7l-7 -7" />
        </svg>
    );
};

export default ArrowNarrowRightIcon;