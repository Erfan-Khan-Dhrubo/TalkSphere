import React from "react";
import { FaThumbsUp, FaComment } from "react-icons/fa";

interface TrendingCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    author: string;
    upVotes: string[];
    commentCount: number;
    createdAt: string;
  };
}

const TrendingCard: React.FC<TrendingCardProps> = ({ post }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 flex flex-col justify-between h-[320px] cursor-pointer">
      {/* Header */}
      <div className="mb-3">
        <p className="font-semibold text-gray-800">{post.author}</p>
        <p className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Title & Content */}
      <div className="flex-1 mb-3">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-700 text-sm line-clamp-4">{post.content}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-gray-600 text-sm border-t border-gray-200 pt-2">
        <div className="flex items-center gap-1">
          <FaThumbsUp className="text-blue-500" /> {post.upVotes.length}
        </div>
        <div className="flex items-center gap-1">
          <FaComment className="text-green-500" /> {post.commentCount}
        </div>
      </div>
    </div>
  );
};

export default TrendingCard;
