import { lazy } from "react";

const Subscription = lazy(() => import("."));
const PaymentSuccess = lazy(() => import("./components/PaymentSuccess"));

const subscriptionRoutes = {
    path: "subscription",
    element: <Subscription />,
};

export const subscriptionSuccessRoute = {
    path: "subscription/success",
    element: <PaymentSuccess />,
};

export default subscriptionRoutes;
