const SearchIcon = (props: any) => {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width={props?.size ?? "19.811"}
            height={props?.size ?? "19.811"}
            viewBox="0 0 19.811 19.811">
            <g id="Search" transform="translate(0.75 0.75)">
                <ellipse
                    id="Ellipse_739"
                    cx="8.622"
                    cy="8.417"
                    rx="8.622"
                    ry="8.417"
                    fill="none"
                    stroke={props?.color ?? "black"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="1.5"
                />
                <path
                    id="Line_181"
                    d="M0,0,3.38,3.291"
                    transform="translate(14.62 14.709)"
                    fill="none"
                    stroke={props?.color ?? "black"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="1.5"
                />
            </g>
        </svg>
    );
};

export default SearchIcon;
