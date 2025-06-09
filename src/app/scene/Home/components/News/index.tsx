import { lazy } from "react";

const Scrolls = lazy(() => import("../Scrolls"));

const News = () => {
    return <Scrolls isNewsPage />;
}

export default News;
