const EyeIcon = (props: any) => {
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
            className="icon icon-tabler icons-tabler-outline icon-tabler-eye"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M1 12s3.5-7 11-7s11 7 11 7s-3.5 7-11 7s-11-7-11-7z" />
            <path d="M12 9a3 3 0 1 1 0 6a3 3 0 0 1 0 -6" />
        </svg>
    );
};

export default EyeIcon;