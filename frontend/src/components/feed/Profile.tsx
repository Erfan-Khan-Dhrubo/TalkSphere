import React, { useContext, useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { AuthContext } from "../../config/AuthPorvider";
import Loader from "../common/Loader";
import { ThumbsDown } from "lucide-react";
import { ThumbsUp } from "lucide-react";
import { uploadToCloudinary } from "../../utilities/imageUpload";
import backendApi from "../../utilities/axios";
import SinglePost from "./newsFeed/SinglePost";

interface ProfileProps {
  userId?: string; // Optional userId - if provided, show that user's profile, otherwise show current user
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const { presentUser, setPresentUser } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    totalUpvotes: 0,
    totalDownvotes: 0,
  });

  // Determine which user to display
  const displayUser = userId ? profileUser : presentUser;
  const isOwnProfile = !userId || userId === presentUser?._id;

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);

        // If userId is provided, fetch that user's data
        if (userId) {
          const userRes = await backendApi.get(`/users/${userId}`);
          setProfileUser(userRes.data);
        }

        // Fetch all posts
        const postsRes = await backendApi.get("/posts");
        setPosts(postsRes.data);

        // Calculate stats for the displayed user
        const targetUserId = userId || presentUser?._id;
        if (targetUserId && postsRes.data) {
          const userPosts = postsRes.data.filter((post: any) => {
            const postUserId = post.userId?._id || post.userId;
            return postUserId === targetUserId;
          });

          const totalUpvotes = userPosts.reduce(
            (sum: number, post: any) => sum + (post.upVotes?.length || 0),
            0
          );

          const totalDownvotes = userPosts.reduce(
            (sum: number, post: any) => sum + (post.downVotes?.length || 0),
            0
          );

          setUserStats({
            totalPosts: userPosts.length,
            totalUpvotes,
            totalDownvotes,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userId, presentUser?._id]);

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    if (!isOwnProfile || !presentUser) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadToCloudinary(file);

    try {
      const res = await backendApi.patch(
        `/users/updateImage/${presentUser.email}`,
        { imageUrl, type }
      );

      setPresentUser(res.data.user); // full updated user object
      return res.data.user;
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!displayUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }
  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      {/* Cover Photo */}
      <div className="relative w-full h-60 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={
            displayUser.coverPic ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Cover"
          className="w-full h-full object-cover"
        />

        {/* Cover camera button (only show for own profile) */}
        {isOwnProfile && (
          <label
            className="absolute right-4 top-4 bg-white/90 p-2 rounded-full shadow hover:scale-105 transition z-2 cursor-pointer"
            aria-label="Camera icon"
          >
            <FaCamera className="h-5 w-5" />
            <input
              type="file"
              className="hidden"
              aria-label="Upload image"
              onChange={(e) => uploadImage(e, "cover")}
            />
          </label>
        )}
      </div>

      {/* Profile Section */}
      <div className="flex items-end gap-4 -mt-16 px-4">
        {/* Profile Image */}
        <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-md bg-white">
          <img
            src={
              displayUser.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />

          {/* Profile camera button (only show for own profile) */}
          {isOwnProfile && (
            <label className="absolute right-0 bottom-0 -mb-1 -mr-1 bg-white p-2 rounded-full shadow hover:scale-105 transition cursor-pointer">
              <FaCamera className="h-5 w-5" />
              <input
                type="file"
                className="hidden"
                aria-label="Upload image"
                onChange={(e) => uploadImage(e, "profile")}
              />
            </label>
          )}
        </div>

        {/* Name and vote */}
        <div className="pb-3">
          <h1 className="text-2xl font-semibold">{displayUser.name}</h1>
          <div className="flex py-2 justify-center items-center gap-2">
            <p className="text-gray-600 text-sm flex justify-center items-center gap-1">
              Posts: {userStats.totalPosts}
            </p>
            <div className="text-gray-600 text-sm">|</div>
            <p className="text-gray-600 text-sm flex justify-center items-center gap-1">
              <ThumbsUp className="w-4 h-4 text-blue-500" />
              {userStats.totalUpvotes}
            </p>
            <div className="text-gray-600 text-sm">|</div>
            <p className="text-gray-600 text-sm flex justify-center items-center gap-1">
              <ThumbsDown className="w-4 h-4 text-red-500" />
              {userStats.totalDownvotes}
            </p>
          </div>
        </div>
      </div>

      {/* My Post */}
      <div>
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">All Posts</h1>
            <span className="text-gray-500 text-sm">
              {
                posts.filter((post: any) => post.userId === presentUser._id)
                  .length
              }{" "}
              posts
            </span>
          </div>

          <hr className="border-gray-300" />

          {/* Posts */}
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available</p>
          ) : (
            posts
              .filter((post: any) => {
                const postUserId = post.userId?._id || post.userId;
                const targetUserId = userId || presentUser?._id;
                return postUserId === targetUserId;
              })
              .map((filteredPost: any) => (
                <SinglePost key={filteredPost._id} post={filteredPost} />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
