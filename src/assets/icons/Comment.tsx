const Comment = (props: any) => {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width={props?.size || "24"} height={props?.size || "24"} viewBox="0 0 24 24">
            <g
                id="vuesax_linear_messages-2"
                data-name="vuesax/linear/messages-2"
                transform="translate(-428 -250)">
                <g id="messages-2">
                    <path
                        id="Vector"
                        d="M14.13,14.83l.39,3.16a1,1,0,0,1-1.5.98L8.83,16.48a9.982,9.982,0,0,1-1.35-.09,4.861,4.861,0,0,0,1.18-3.16,5.327,5.327,0,0,0-5.5-5.14A5.683,5.683,0,0,0,.04,9,6.339,6.339,0,0,1,0,8.24C0,3.69,3.95,0,8.83,0s8.83,3.69,8.83,8.24A8.054,8.054,0,0,1,14.13,14.83Z"
                        transform="translate(432.34 252)"
                        fill="none"
                        stroke={props?.color || '#292d32'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    />
                    <path
                        id="Vector-2"
                        data-name="Vector"
                        d="M11,5.14A4.861,4.861,0,0,1,9.82,8.3,5.584,5.584,0,0,1,5.5,10.27L2.89,11.82a.625.625,0,0,1-.94-.61L2.2,9.24A4.988,4.988,0,0,1,0,5.14,5.023,5.023,0,0,1,2.38.91,5.683,5.683,0,0,1,5.5,0,5.327,5.327,0,0,1,11,5.14Z"
                        transform="translate(430 260.09)"
                        fill="none"
                        stroke={props?.color || '#292d32'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    />
                    <path
                        id="Vector-3"
                        data-name="Vector"
                        d="M0,0H24V24H0Z"
                        transform="translate(428 250)"
                        fill="none"
                        opacity="0"
                    />
                </g>
            </g>
        </svg>
    )
}

export default Comment