import { lazy } from "react";

const Promotions = lazy(() => import("."));

const promotionRoute = {
    path: "promotions",
    element: <Promotions />,
}

export default promotionRoute;
