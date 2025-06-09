import { useEffect } from "react";

declare global {
    interface Window {
        adsbygoogle: any;
    }
}

const AdBanner = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);

        script.onload = () => {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense error:", e);
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="!h-full">
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-6634045201319545"
                data-ad-slot="1403940375"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default AdBanner;
