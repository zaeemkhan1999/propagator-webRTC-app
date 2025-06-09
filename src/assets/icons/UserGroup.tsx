const UsersGroupIcon = (props: any) => {
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
            className="icon icon-tabler icons-tabler-outline icon-tabler-users-group"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
            <path d="M4 14v1a4 4 0 0 0 4 4h4a4 4 0 0 0 4 -4v-1" />
            <path d="M14 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
            <path d="M18 14v1a4 4 0 0 0 4 4h4a4 4 0 0 0 4 -4v-1" />
        </svg>
    );
};

export default UsersGroupIcon;