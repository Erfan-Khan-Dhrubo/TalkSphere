import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaComment, FaBookmark } from "react-icons/fa";
import { AuthContext } from "../../../config/AuthPorvider";
import backendApi from "../../../utilities/axios";
import VoteDownvoteButton from "./VoteDownvoteButton";
import ReportPostButton from "../../ReportPostButton";

// ----------- TYPES -------------
interface PostType {
  _id: string;
  title: string;
  content: string;
  author: string;
  userId: string;
  userImage?: string;
  image?: string;
  upVotes: number;
  downVotes: number;
  commentCount: number;
  createdAt: string;
}

// ----------- COMPONENT -------------
const SinglePost: React.FC<{ post: PostType }> = ({ post }) => {
  const navigate = useNavigate();

  const { presentUser } = useContext(AuthContext);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  // Set initial favorite state
  useEffect(() => {
    setIsFavorite(presentUser?.savedPosts?.includes(post._id) || false);
  }, [presentUser, post._id]);

  const maxLength = 120;
  const isLong = post.content.length > maxLength;

  const displayedText =
    expanded || !isLong
      ? post.content
      : post.content.slice(0, maxLength) + "...";

  // ----------- Favorite Logic -------------
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!presentUser) return;

    try {
      const isAlreadySaved = presentUser.savedPosts.includes(post._id);
      const action = isAlreadySaved ? "remove" : "add";

      const res = await backendApi.post("/users/save-post", {
        userId: presentUser._id,
        postId: post._id,
        action,
      });

      if (res.status === 200) {
        setIsFavorite(!isAlreadySaved);

        // Update local user savedPosts
        if (action === "add") {
          presentUser.savedPosts.push(post._id);
        } else {
          presentUser.savedPosts = presentUser.savedPosts.filter(
            (id: string) => id !== post._id
          );
        }
      }
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  const openDetails = () => navigate(`/feed/postDetails/${post._id}`);

  // ----------- UI -------------
  return (
    <div
      onClick={openDetails}
      className="max-w-2xl mx-auto mt-4 bg-white border border-gray-300 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
    >
      {/* Header */}
      <div className="flex items-center p-4">
        <img
          src={post.userImage || "/default-profile.png"}
          alt={post.author}
          className="w-10 h-10 rounded-full mr-3"
        />

        <div>
          <p
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/user/${post.userId}`);
            }}
            className="font-semibold hover:text-blue-600 cursor-pointer"
          >
            {post.author}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={toggleFavorite}
          className="ml-auto text-gray-500 hover:text-blue-600 transition"
        >
          <FaBookmark
            size={20}
            className={isFavorite ? "text-blue-600" : "text-gray-400"}
          />
        </button>
      </div>

      {/* Title + Content */}
      <div className="px-4">
        <h2 className="font-bold text-lg mb-2">{post.title}</h2>

        <p
          className="text-gray-700 whitespace-pre-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          {displayedText}

          {isLong && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="text-blue-500 font-semibold ml-2 hover:underline"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          className="w-full mt-3 object-cover max-h-96"
          alt=""
        />
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <VoteDownvoteButton
          postId={post._id}
          upVotes={post.upVotes as unknown as string[]}
          downVotes={post.downVotes as unknown as string[]}
        />

        <div className="flex items-center gap-4 text-gray-600">
          <div
            onClick={(e) => {
              e.stopPropagation();
              openDetails();
            }}
            className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
          >
            <FaComment /> {post.commentCount} Comments
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ReportPostButton postId={post._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
