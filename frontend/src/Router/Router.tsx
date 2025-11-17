import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Description from "../pages/Home/Description";
import Login from "../pages/Home/Login";
import Signup from "../pages/Home/Signup";
import Feed from "../pages/Feed/Feed";
import NewsFeed from "../pages/Feed/NewsFeed";
import PrivateRoutes from "./PrivateRoutes";
import MyProfile from "../pages/Feed/MyProfile";

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
  {
    path: "/feed",
    element: <Feed />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoutes>
            <NewsFeed />
          </PrivateRoutes>
        ),
      },
      {
        path: "/feed/profile",
        element: (
          <PrivateRoutes>
            <MyProfile />
          </PrivateRoutes>
        ),
      },
    ],
  },
]);
