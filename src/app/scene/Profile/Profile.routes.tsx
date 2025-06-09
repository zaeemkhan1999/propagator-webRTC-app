import { lazy } from "react";

const UserProfile = lazy(() => import("."));
const SavedPosts = lazy(() => import("./components/SavedPosts"));
const ProfileSettings = lazy(() => import("./components/Profilesettings"));

const ProfilePageRoute = {
  path: "profile",
  element: <UserProfile />,
};

export const profileSettingsRoute = {
  path: "profile/settings",
  element: <ProfileSettings />,
};

export const profileSavedPosts = {
  path: "profile/saved-posts",
  element: <SavedPosts />,
};

export default ProfilePageRoute;
