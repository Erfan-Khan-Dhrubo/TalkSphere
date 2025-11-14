import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Description from "../pages/Home/Description";
import Login from "../pages/Home/Login";
import Signup from "../pages/Home/Signup";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <Description />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
]);
