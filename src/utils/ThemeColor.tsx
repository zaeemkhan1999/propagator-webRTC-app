import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ThemeColorHandler = () => {
    const location = useLocation();

    useEffect(() => {
        const metaThemeColor = document.querySelector("meta[name=theme-color]");

        const pageColor = getPageThemeColor(location.pathname);

        if (metaThemeColor) {
            metaThemeColor.setAttribute("content", pageColor);
        }
        document.body.style.backgroundColor = pageColor;
        if ("setProperty" in document.documentElement.style) {
            document.documentElement.style.setProperty("--nav-bar-color", pageColor);
        }
    }, [location]);

    const getPageThemeColor = (pathname: any) => {
        switch (pathname) {
            case "/specter/profile":
                return "#ffffff";
            case "/specter/home":
                return "#000000";
            case "/specter/groups":
                return "#5A8EBB";
            case pathname.match(/^\/specter\/groups\/\d+$/)?.input:
                return "#5A8EBB";
            case "/specter/inbox":
                return "#5A8EBB";
            case pathname.match(/^\/specter\/inbox\/chat\/[a-zA-Z0-9_-]+$/)?.input:
                return "#000000";
            case pathname.match(/^\/specter\/groups\/\d+\/topics\/\d+$/)?.input:
                return "#5A8EBB";
            default:
                return "#000000";
        }
    };

    return null;
};

export default ThemeColorHandler;