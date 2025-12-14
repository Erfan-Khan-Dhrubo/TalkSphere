import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  FaThumbsDown,
  FaThumbsUp,
  FaReply,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaFlag,
} from "react-icons/fa";
import type { CommentNode } from "./CommentSection";
import ReportCommentModal from "../ReportCommentModal";

interface CommentItemProps {
  comment: CommentNode;
  currentUserId?: string;
  onReply: (commentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onVote: (commentId: string, type: "upvote" | "downvote") => void;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onVote,
  depth = 0,
}) => {
  const navigate = useNavigate();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const likedBy = comment.likedBy || [];
  const dislikedBy = comment.dislikedBy || [];

  const isOwner = useMemo(() => {
    if (typeof comment.userId === "string")
      return comment.userId === currentUserId;
    return comment.userId?._id === currentUserId;
  }, [comment.userId, currentUserId]);

  const hasLiked = useMemo(
    () => likedBy.some((id) => id === currentUserId),
    [likedBy, currentUserId]
  );
  const hasDisliked = useMemo(
    () => dislikedBy.some((id) => id === currentUserId),
    [dislikedBy, currentUserId]
  );

  const authorName =
    typeof comment.userId === "string"
      ? "Unknown"
      : comment.userId?.name || "Unknown";
  const authorImage =
    typeof comment.userId === "string"
      ? "/default-profile.png"
      : comment.userId?.profilePic;
  const authorId =
    typeof comment.userId === "string" ? comment.userId : comment.userId?._id;

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onReply(comment._id, replyText);
    setReplyText("");
    setIsReplying(false);
  };

  const handleSubmitEdit = () => {
    if (!editText.trim()) return;
    onEdit(comment._id, editText);
    setIsEditing(false);
  };

  const replyCount = comment.replies?.length || 0;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm`}>
      <div className="flex items-start gap-3">
        <img
          src={authorImage || "/default-profile.png"}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p
              onClick={() => {
                if (authorId) {
                  navigate(`/feed/profile/${authorId}`);
                }
              }}
              className={`font-semibold ${
                authorId ? "hover:text-blue-600 cursor-pointer" : ""
              }`}
            >
              {authorName}
            </p>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSubmitEdit}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.content);
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-gray-700 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <button
              onClick={() => onVote(comment._id, "upvote")}
              className={`flex items-center gap-1 hover:text-blue-600 ${
                hasLiked ? "text-blue-600" : ""
              }`}
            >
              <FaThumbsUp /> {comment.likes}
            </button>
            <button
              onClick={() => onVote(comment._id, "downvote")}
              className={`flex items-center gap-1 hover:text-red-500 ${
                hasDisliked ? "text-red-500" : ""
              }`}
            >
              <FaThumbsDown /> {comment.dislikes}
            </button>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <FaReply /> Reply
            </button>
            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 hover:text-green-600"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => onDelete(comment._id)}
                  className="flex items-center gap-1 hover:text-red-600"
                >
                  <FaTrash /> Delete
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReportModalOpen(true);
              }}
              className="flex items-center gap-1 hover:text-red-500 text-sm text-red-500 font-semibold"
            >
              <FaFlag /> Report
            </button>
          </div>
          <ReportCommentModal
            commentId={comment._id}
            open={reportModalOpen}
            onClose={() => setReportModalOpen(false)}
          />

          {isReplying && (
            <div className="mt-3">
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSubmitReply}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {replyCount > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-blue-600 mt-3 text-sm"
            >
              {showReplies ? <FaChevronUp /> : <FaChevronDown />}
              {showReplies ? "Hide replies" : `Show replies (${replyCount})`}
            </button>
          )}

          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3 ml-8">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onVote={onVote}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
