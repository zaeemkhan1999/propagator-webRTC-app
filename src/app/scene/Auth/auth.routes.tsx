import { lazy } from "react";

const Auth = lazy(() => import("./Auth"));
const SignIn = lazy(() => import('./components/SignIn'));
const SignUp = lazy(() => import('./components/SignUp'));
const ForgotPassword = lazy(() => import("./components/ForgetPassword"));
const Security = lazy(() => import("./components/Security"));
const Support = lazy(() => import("./components/Support"));

const AuthRoutes = {
  path: "/auth/",
  element: <Auth />,
  children: [
    {
      path: "signin",
      element: <SignIn />,
    },
    {
      path: "signup",
      element: <SignUp />,
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "security",
      element: <Security />,
    },
    {
      path: "contact-support",
      element: <Support />,
    },
  ],
};

export default AuthRoutes;
