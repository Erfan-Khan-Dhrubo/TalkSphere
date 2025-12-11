import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaBookmark,
} from "react-icons/fa";
import { AuthContext } from "../../../config/AuthPorvider";
import backendApi from "../../../utilities/axios";

interface Post {
  _id: string;
  userId: string;
  author: string;
  title: string;
  content: string;
  image?: string;
  userImage?: string;
  upVotes: number;
  downVotes: number;
  commentCount: number;
  createdAt: string;
}

interface Props {
  post: Post;
}

const SinglePost: React.FC<Props> = ({ post }) => {
  const navigate = useNavigate();
  const { presentUser } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);

  // Initialize favorite state
  useEffect(() => {
    if (presentUser?.savedPosts?.includes(post._id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [presentUser, post._id]);

  const maxLength = 120;
  const isLong = post.content.length > maxLength;
  const truncatedText = isLong
    ? post.content.slice(0, maxLength) + "..."
    : post.content;

  // Toggle favorite
  const handleFavorite = async () => {
    try {
      const isAlreadySaved = presentUser.savedPosts.includes(post._id);
      const action = isAlreadySaved ? "remove" : "add";

      // Call backend
      const res = await backendApi.post("/users/save-post", {
        userId: presentUser._id,
        postId: post._id,
        action,
      });

      // Update UI only if backend returns success
      if (res.status === 200) {
        setIsFavorite(!isAlreadySaved);

        // Optional: Update presentUser context savedPosts to reflect change
        if (action === "add") {
          presentUser.savedPosts.push(post._id);
        } else {
          presentUser.savedPosts = presentUser.savedPosts.filter(
            (id: string) => id !== post._id
          );
        }
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      // No UI change if backend fails
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white border border-gray-300 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center p-4">
        <img
          src={post.userImage || "/default-profile.png"}
          alt={post.author}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold">{post.author}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="ml-auto text-gray-500 hover:text-blue-600 transition"
        >
          <FaBookmark
            className={isFavorite ? "text-blue-600" : "text-gray-400"}
            size={20}
          />
        </button>
      </div>

      {/* Title + Content */}
      <div className="px-4">
        <h2 className="font-bold text-lg mb-2">{post.title}</h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {truncatedText}
          {isLong && (
            <button
              onClick={() => navigate(`/post/${post._id}`)}
              className="text-blue-500 font-semibold ml-1 hover:underline"
            >
              See more
            </button>
          )}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full mt-3 object-cover max-h-96"
        />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-gray-600">
          <button className="flex items-center gap-1 hover:text-blue-500 transition">
            <FaThumbsUp /> {post.upVotes}
          </button>

          <button className="flex items-center gap-1 hover:text-red-500 transition">
            <FaThumbsDown /> {post.downVotes}
          </button>
        </div>

        <div className="flex items-center gap-1 text-gray-600">
          <FaComment /> {post.commentCount} Comments
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
