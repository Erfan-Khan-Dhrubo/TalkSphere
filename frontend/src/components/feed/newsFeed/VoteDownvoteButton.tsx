import React, { useContext, useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { AuthContext } from "../../../config/AuthPorvider";
import backendApi from "../../../utilities/axios";

interface VoteProps {
  postId: string;
  upVotes: string[];
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

  const [floatUp, setFloatUp] = useState(false);
  const [floatDown, setFloatDown] = useState(false);

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
        setUpvoteCount(updatedPost.upVotes.length);
        setDownvoteCount(updatedPost.downVotes.length);
        setHasUpvoted(updatedPost.upVotes.includes(presentUser._id));
        setHasDownvoted(updatedPost.downVotes.includes(presentUser._id));

        // trigger animation
        if (type === "upvote") {
          setFloatUp(true);
          setTimeout(() => setFloatUp(false), 800);
        } else {
          setFloatDown(true);
          setTimeout(() => setFloatDown(false), 800);
        }
      }
    } catch (err) {
      console.error(`${type} failed:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-6 relative">
      <div className="relative">
        <button
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            handleVote("upvote");
          }}
          className={`flex items-center gap-1 text-lg ${
            hasUpvoted ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
          }`}
        >
          <FaThumbsUp /> {upvoteCount}
        </button>
        {floatUp && (
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-blue-600 font-bold animate-floatUp">
            +1
          </span>
        )}
      </div>

      <div className="relative">
        <button
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            handleVote("downvote");
          }}
          className={`flex items-center gap-1 text-lg ${
            hasDownvoted ? "text-red-600" : "text-gray-600 hover:text-red-500"
          }`}
        >
          <FaThumbsDown /> {downvoteCount}
        </button>
        {floatDown && (
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-600 font-bold animate-floatUp">
            -1
          </span>
        )}
      </div>
    </div>
  );
};

export default VoteDownvoteButton;
