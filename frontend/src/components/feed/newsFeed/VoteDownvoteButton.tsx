import React, { useContext, useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { AuthContext } from "../../../config/AuthPorvider";
import backendApi from "../../../utilities/axios";

interface VoteProps {
  postId: string;
  upVotes: string[]; // array of userIds
  downVotes: string[];
}

const VoteDownvoteButton: React.FC<VoteProps> = ({
  postId,
  upVotes,
  downVotes,
}) => {
  const { presentUser } = useContext(AuthContext);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);

  // Initialize counts and user vote status
  useEffect(() => {
    setUpvoteCount(upVotes.length);
    setDownvoteCount(downVotes.length);

    if (!presentUser) return;
    setHasUpvoted(upVotes.includes(presentUser._id));
    setHasDownvoted(downVotes.includes(presentUser._id));
  }, [upVotes, downVotes, presentUser]);

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!presentUser) return;
    setLoading(true);

    try {
      const res = await backendApi.patch(`/posts/${postId}/${type}`, {
        userId: presentUser._id,
      });

      if (res.status === 200) {
        const updatedPost = res.data;

        // Update vote counts
        setUpvoteCount(updatedPost.upVotes.length);
        setDownvoteCount(updatedPost.downVotes.length);

        // Update user vote status
        setHasUpvoted(updatedPost.upVotes.includes(presentUser._id));
        setHasDownvoted(updatedPost.downVotes.includes(presentUser._id));
      }
    } catch (err) {
      console.error(`${type} failed:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 text-gray-600">
      <button
        disabled={loading}
        onClick={(e) => {
          e.stopPropagation();
          handleVote("upvote");
        }}
        className={`flex items-center gap-1 ${
          hasUpvoted ? "text-blue-600" : "hover:text-blue-500"
        }`}
      >
        <FaThumbsUp /> {upvoteCount}
      </button>

      <button
        disabled={loading}
        onClick={(e) => {
          e.stopPropagation();
          handleVote("downvote");
        }}
        className={`flex items-center gap-1 ${
          hasDownvoted ? "text-red-600" : "hover:text-red-500"
        }`}
      >
        <FaThumbsDown /> {downvoteCount}
      </button>
    </div>
  );
};

export default VoteDownvoteButton;
