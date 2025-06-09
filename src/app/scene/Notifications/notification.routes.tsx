import { lazy } from "react";

const Notifications = lazy(() => import("."));

const notificationRoute = {
    path: "notifications",
    element: <Notifications />
}

export default notificationRoute;
