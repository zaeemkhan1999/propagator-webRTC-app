import { lazy } from "react";

const Groups = lazy(() => import("."));
const GroupDetails = lazy(() => import("./components/GroupDetail"));
const TopicsArea = lazy(() => import("./components/TopicsArea"));

const groupsRoutes = {
  path: "groups",
  element: <Groups />,
};

export const groupDetailsRoute = {
  path: "groups/:groupId",
  element: <GroupDetails />,
};

export const groupTopicsRoute = {
  path: "groups/:gId/topics/:tId",
  element: <TopicsArea />,
};

export default groupsRoutes;
