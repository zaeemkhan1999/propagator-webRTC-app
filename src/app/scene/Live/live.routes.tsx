import { lazy } from "react";

const Live = lazy(() => import("."));
const Modal = lazy(() => import("./modal"));

const livePageRoutes = {
  path: "live",
  element: <Modal />,
  children: [
    {
      path: "pg",
      element: <Live />,
    },
    {
      path: "fz",
      element: <Live />,
    },
  ],
};

export default livePageRoutes;
