const Filter = (props: any) => {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width={props?.size ?? "24"}
            height={props?.size ?? "24"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-filter"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />
        </svg>
    );
}

export default Filter;