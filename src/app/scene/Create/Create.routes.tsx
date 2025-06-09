import { lazy } from "react";

const CreatePage = lazy(() => import("."));
const CreatePostPage = lazy(() => import("./components/Createpost"));
const CreateProductPage = lazy(() => import("./components/CreateProduct"));
const CreateScrollPage = lazy(() => import("./components/Createarticle"));

const CreatePageRoutes = {
  path: "create",
  element: <CreatePage />,
  children: [
    {
      path: "post",
      element: <CreatePostPage />,
    },
    {
      path: "product",
      element: <CreateProductPage />,
    },
    {
      path: "scroll",
      element: <CreateScrollPage />,
    }
  ]
};

export default CreatePageRoutes;