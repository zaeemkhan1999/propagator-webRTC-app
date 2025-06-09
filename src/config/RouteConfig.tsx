import authRoute from "../app/scene/Auth/auth.routes";
import LandingPageRoutes from "../app/scene/Landing/Landing.routes";
import masterlayoutRoutes from "../app/scene/MasterLayout/masterlayout.routes";
import NotFound from "@/components/NotFound/NotFound";

const childRoutes = [
  LandingPageRoutes,
  authRoute,
  masterlayoutRoutes,
];

const routes = [
  ...childRoutes,
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
