import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Description from "../pages/Home/Description";
import Login from "../pages/Home/Login";
import Signup from "../pages/Home/Signup";
import Feed from "../pages/Feed/Feed";
import NewsFeed from "../pages/Feed/NewsFeed";
import PrivateRoutes from "./PrivateRoutes";
import MyProfile from "../pages/Feed/MyProfile";
import CreatePost from "../pages/Feed/CreatePost";
import Favorites from "../pages/Feed/Favorites";
import PostDetails from "../pages/Post/PostDetails";
import EditPost from "../pages/Post/EditPost";
import Reports from "../pages/Moderation/Reports";
import AllAnnouncements from "../pages/Moderation/AllAnnouncements";

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
      {
        path: "/feed/createPost",
        element: (
          <PrivateRoutes>
            <CreatePost />
          </PrivateRoutes>
        ),
      },
      {
        path: "/feed/favorites",
        element: (
          <PrivateRoutes>
            <Favorites />
          </PrivateRoutes>
        ),
      },
      {
        path: "/feed/reports",
        element: (
          <PrivateRoutes>
            <Reports />
          </PrivateRoutes>
        ),
      },
      {
        path: "/feed/announcements",
        element: (
          <PrivateRoutes>
            <AllAnnouncements />
          </PrivateRoutes>
        ),
      },
      {
        path: "/feed/postDetails/:id",
        element: (
          <PrivateRoutes>
            <PostDetails />
          </PrivateRoutes>
        ),
      },
      {
        path: "/feed/editPost/:id",
        element: (
          <PrivateRoutes>
            <EditPost />
          </PrivateRoutes>
        ),
      },
    ],
  },
]);
