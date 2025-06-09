import React from 'react';

const Index = (props: any) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke={props.color}>
            <g
                id="vuesax_linear_add-square"
                data-name="vuesax/linear/add-square"
                transform="translate(-620 -252)">
                <g id="add-square" transform="translate(620 252)">
                    <path
                        id="Vector"
                        d="M0,0H8"
                        transform="translate(8 12)"
                        fill="none"
                        stroke={props.color}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    />
                    <path
                        id="Vector-2"
                        data-name="Vector"
                        d="M0,8V0"
                        transform="translate(12 8)"
                        fill="none"
                        stroke={props.color}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    />
                    <path
                        id="Vector-3"
                        data-name="Vector"
                        d="M7,20h6c5,0,7-2,7-7V7c0-5-2-7-7-7H7C2,0,0,2,0,7v6C0,18,2,20,7,20Z"
                        transform="translate(2 2)"
                        fill="none"
                        stroke={props.color}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    />
                    <path
                        id="Vector-4"
                        data-name="Vector"
                        d="M0,0H24V24H0Z"
                        fill="none"
                        opacity="0"
                    />
                </g>
            </g>
        </svg>
    );
};

export default Index;
