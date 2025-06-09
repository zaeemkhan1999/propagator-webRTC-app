import { useState, useEffect } from "react";

const useIsSafari = () => {
    const [isSafari, setIsSafari] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        const isIOS = /iPhone|iPad|iPod/.test(userAgent);
        const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
        const isMac = /Macintosh/.test(userAgent);

        setIsSafari((isIOS || isMac) && isSafariBrowser);
    }, []);

    return isSafari;
};

export default useIsSafari;
