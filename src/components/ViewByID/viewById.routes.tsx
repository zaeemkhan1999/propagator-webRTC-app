import { lazy } from "react";

const ViewById = lazy(() => import("."));

const viewByIdRoute = {
    path: "view/:type/:id",
    element: <ViewById />
};

export default viewByIdRoute;
