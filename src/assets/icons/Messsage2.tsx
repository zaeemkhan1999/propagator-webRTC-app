const Message2Icon = (props: any) => {
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
            className="icon icon-tabler icons-tabler-outline icon-tabler-message-2"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M2 8c0 3.75 3.75 6 8 6s8-2.25 8-6s-3.75-6-8-6s-8 2.25-8 6z" />
            <path d="M12 14v4l3-3l3 3v-4" />
        </svg>
    );
};

export default Message2Icon;