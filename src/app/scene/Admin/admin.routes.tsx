import { lazy } from "react";

const Admins = lazy(() => import("./components/Admins"));
const AdminPermissions = lazy(() => import("./components/AdminPermissions"));
const NonAdmins = lazy(() => import("./components/NonAdmins"));
const BannedUsers = lazy(() => import("./components/BannedUsers"));
const Discounts = lazy(() => import("./components/Discounts"));

const adminRoute = {
    path: "admin/",
    element: <Admins />
};

export const adminPermissionRoute = {
    path: "admin/permissions/:username",
    element: <AdminPermissions />
}

export const nonAdminsRoute = {
    path: "admin/non-admins",
    element: <NonAdmins />
}

export const bannedUserRoute = {
    path: "admin/banned-users",
    element: <BannedUsers />
}

export const discountRoute = {
    path: "admin/discounts",
    element: <Discounts />
}

export default adminRoute;
