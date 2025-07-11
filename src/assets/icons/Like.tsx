const Like = (props: any) => {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width={props?.size || 24}
            height={props?.size || 24}
            viewBox="0 0 8.467 8.467"
            id="like"
            fill="currentColor"
            stroke="none"
        >
            <path
                d="M1.322 7.674a.535.535 0 0 1-.53-.53V3.44c0-.289.242-.53.53-.53h.795c.196 0 .368.113.46.275.178-.11.353-.174.466-.239.266-.154.402-.586.465-1.037.031-.225.048-.442.076-.623.014-.09.027-.17.064-.258a.353.353 0 0 1 .32-.235c.393 0 .715.154.92.39.206.235.302.53.354.822.084.478.052.883.036 1.172h1.6c.436 0 .796.358.796.793 0 .154-.044.27-.1.45-.056.181-.131.399-.215.632-.166.466-.364.994-.494 1.383a1.32 1.32 0 0 1-.24.459.724.724 0 0 1-.539.251H2.91a.774.774 0 0 1-.264-.049v.05c0 .288-.24.529-.529.529zm0-.53h.795V3.44h-.795zm1.588-.529h3.176c.07 0 .092-.014.138-.068a.913.913 0 0 0 .14-.282c.135-.405.333-.932.497-1.392.082-.23.156-.443.207-.61.052-.166.077-.316.077-.294a.259.259 0 0 0-.266-.264H5.004a.265.265 0 0 1-.266-.266c0-.312.068-.87-.015-1.344-.042-.236-.12-.435-.233-.564a.607.607 0 0 0-.378-.199c-.027.151-.045.409-.079.65-.069.493-.199 1.117-.726 1.422-.197.113-.387.18-.5.258-.114.078-.16.12-.16.307v2.38c0 .152.112.266.263.266z"
            />
        </svg>
    );
};

export default Like;