import { lazy } from "react";

const You = lazy(() => import("../You"));

const Stories = () => {
  return <You isStoriesPage />;
}

export default Stories;
