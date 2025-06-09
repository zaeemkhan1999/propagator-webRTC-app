const MessageFilledIcon = (props: any) => {
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
            className="icon icon-tabler icons-tabler-outline icon-tabler-message-filled"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M21 10c0 5.5 -4.5 10 -10 10c-2.3 0 -4.5 -.8 -6.4 -2.1l-3.4 1.7a1 1 0 0 1 -1.3 -1.3l1.7 -3.4c-1.3 -1.9 -2.1 -4.1 -2.1 -6.4c0 -5.5 4.5 -10 10 -10s10 4.5 10 10z" fill="currentColor" />
        </svg>
    );
};

export default MessageFilledIcon;