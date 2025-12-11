import React from "react";
import { useNavigate } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";

const SinglePost: React.FC = () => {
  const navigate = useNavigate();

  // Fake post data
  const post = {
    user: {
      name: "John Doe",
      profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    title: "My First Post",
    content:
      "This is a sample post content. I'm learning React and building a social media platform. It has multiple lines of text to test the see more functionality.",
    image: "https://via.placeholder.com/600x300",
    upVotes: 12,
    downVotes: 2,
    comments: 4,
    createdAt: "2025-11-21T10:30:00Z",
  };

  // Truncate text if long
  const maxLength = 120;
  const isLong = post.content.length > maxLength;
  const truncatedText = isLong
    ? post.content.slice(0, maxLength) + "..."
    : post.content;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white border border-gray-300 rounded-lg shadow-md">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <img
          src={post.user.profilePic}
          alt={post.user.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold">{post.user.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Post Title */}
      <div className="px-4">
        <h2 className="font-bold text-lg mb-2">{post.title}</h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {truncatedText}
          {isLong && (
            <button
              onClick={() => navigate("/home")}
              className="text-blue-500 font-semibold ml-1 hover:underline"
            >
              See more
            </button>
          )}
        </p>
      </div>

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full mt-3 object-cover max-h-96"
        />
      )}

      {/* Post Actions */}
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
          <FaComment /> {post.comments} Comments
        </div>
      </div>
    </div>
  );
};
export default SinglePost;
