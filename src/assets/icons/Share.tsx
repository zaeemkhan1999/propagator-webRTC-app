const Share = (props: any) => {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width={props?.size || "24"} height={props?.size || "24"} viewBox="0 0 24 24">
            <g
                id="vuesax_linear_send-2"
                data-name="vuesax/linear/send-2"
                transform="translate(-300 -316)">
                <g id="send-2">
                    <path
                        id="Vector"
                        d="M4.283,3.2l8.49-2.83c3.81-1.27,5.88.81,4.62,4.62l-2.83,8.49c-1.9,5.71-5.02,5.71-6.92,0l-.84-2.52-2.52-.84C-1.427,8.223-1.427,5.113,4.283,3.2Z"
                        transform="translate(303.117 319.117)"
                        fill="none"
                        stroke={props.color || '#292d32'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    />
                    <path
                        id="Vector-2"
                        data-name="Vector"
                        d="M0,3.59,3.58,0"
                        transform="translate(310.11 326.06)"
                        fill="none"
                        stroke={props.color || '#292d32'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    />
                    <path
                        id="Vector-3"
                        data-name="Vector"
                        d="M0,0H24V24H0Z"
                        transform="translate(300 316)"
                        fill="none"
                        opacity="0"
                    />
                </g>
            </g>
        </svg>
    )
}

export default Share