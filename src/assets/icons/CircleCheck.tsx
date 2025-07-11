const CircleCheckIcon = (props: any) => {
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
            className="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 12l2 2l4 -4" />
            <path d="M12 3a9 9 0 1 0 9 9a9 9 0 0 0 -9 -9" />
        </svg>
    );
};

export default CircleCheckIcon;