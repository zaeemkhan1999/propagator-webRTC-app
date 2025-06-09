import React from 'react'

const UserProfile = ({...props}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 76 76" {...props}>
            <g id="Group_9289" data-name="Group 9289" transform="translate(-60 -337)">
                <rect id="Rectangle_2217" data-name="Rectangle 2217" width="76" height="76" rx="38" transform="translate(60 337)" fill="#8f8f8f" />
                <g id="person_black_24dp" transform="translate(76 353)">
                    <path id="Path_30144" data-name="Path 30144" d="M0,0H44V44H0Z" fill="none" />
                    <path id="Path_30145" data-name="Path 30145" d="M22,22a9,9,0,1,0-9-9A9,9,0,0,0,22,22Zm0,4.5c-6.008,0-18,3.015-18,9V40H40V35.5C40,29.515,28.008,26.5,22,26.5Z" fill="#fff" />
                </g>
            </g>
        </svg>
    )
}

export default UserProfile