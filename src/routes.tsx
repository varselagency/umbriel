import { createBrowserRouter } from "react-router-dom";
import SignIn from "@/pages/sign-in";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
]);
