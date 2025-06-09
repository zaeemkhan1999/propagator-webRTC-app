import { lazy } from "react";

const StoryEditor = lazy(() => import("./components/StoryEditor"));

const storyEditorRoute = {
    path: "/specter/story/editor",
    element: <StoryEditor />
};

export default storyEditorRoute;
