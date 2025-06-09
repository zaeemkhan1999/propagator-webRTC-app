import { lazy } from 'react';

const Explore = lazy(() => import('.'));

const explorePageRoutes = {
  path: "explore",
  element: <Explore />,
};

export default explorePageRoutes;