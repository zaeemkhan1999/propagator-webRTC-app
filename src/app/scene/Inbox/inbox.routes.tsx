import { lazy } from 'react';

const Inbox = lazy(() => import('.'));
const AllUsers = lazy(() => import('./components/AllUsers'));
const Messaging = lazy(() => import('./components/Messaging'));

const inboxPageRoute = {
    path: "inbox",
    element: <Inbox />
};

export const chatUsersRoute = {
    path: "inbox/all-users",
    element: <AllUsers />
};

export const chatPageRoute = {
    path: "inbox/chat/:username",
    element: <Messaging />
};

export default inboxPageRoute;
