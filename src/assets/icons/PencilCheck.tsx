const PencilCheckIcon = (props: any) => {
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
            className="icon icon-tabler icons-tabler-outline icon-tabler-pencil-check"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 12l2 2l4 -4" />
            <path d="M5 20h14v-14l-2 -2h-4l-2 2l-4 -4h-2a2 2 0 0 0 -2 2v14" />
        </svg>
    );
};

export default PencilCheckIcon;