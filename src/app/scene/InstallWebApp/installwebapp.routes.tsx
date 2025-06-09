import { lazy } from "react";

const InstallGuide = lazy(() => import("."));

const installWebAppRoute = {
    path: "install",
    element: <InstallGuide />
}

export default installWebAppRoute;
