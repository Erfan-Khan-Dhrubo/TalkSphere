import React, { useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../config/AuthPorvider";
import backendApi from "../../utilities/axios";
import CommentItem from "./CommentItem";

export interface CommentUser {
  _id: string;
  name: string;
  profilePic?: string;
}

export interface CommentNode {
  _id: string;
  postId: string;
  userId: CommentUser | string;
  content: string;
  parentId?: string | null;
  likes: number;
  dislikes: number;
  likedBy?: string[];
  dislikedBy?: string[];
  createdAt: string;
  updatedAt: string;
  replies?: CommentNode[];
}

interface CommentSectionProps {
  postId: string;
  onCountChange?: (count: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  onCountChange,
}) => {
  const { presentUser } = useContext(AuthContext) as {
    presentUser?: { _id: string; name?: string; profilePic?: string };
  };
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>("");

  const authHeaders = useMemo(() => {
    if (!presentUser) return {};
    return {
      Authorization: `Bearer ${presentUser._id}`,
    };
  }, [presentUser]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await backendApi.get<CommentNode[]>(`/comments/${postId}`);
      const list =
        res.data?.map((c) => ({
          ...c,
          likedBy: c.likedBy || [],
          dislikedBy: c.dislikedBy || [],
        })) || [];
      setComments(list);
      onCountChange?.(countComments(list));
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const countComments = (list: CommentNode[]) => {
    let count = 0;
    const stack = [...list];
    while (stack.length) {
      const node = stack.pop()!;
      count += 1;
      if (node.replies?.length) stack.push(...node.replies);
    }
    return count;
  };

  const updateCommentInTree = (
    list: CommentNode[],
    commentId: string,
    updater: (node: CommentNode) => CommentNode
  ): CommentNode[] => {
    return list.map((node) => {
      if (node._id === commentId) {
        return updater(node);
      }
      if (node.replies?.length) {
        return { ...node, replies: updateCommentInTree(node.replies, commentId, updater) };
      }
      return node;
    });
  };

  const addReplyToTree = (
    list: CommentNode[],
    parentId: string,
    reply: CommentNode
  ): CommentNode[] => {
    return list.map((node) => {
      if (node._id === parentId) {
        const replies = node.replies ? [...node.replies, reply] : [reply];
        return { ...node, replies };
      }
      if (node.replies?.length) {
        return { ...node, replies: addReplyToTree(node.replies, parentId, reply) };
      }
      return node;
    });
  };

  const removeCommentFromTree = (
    list: CommentNode[],
    commentId: string
  ): { next: CommentNode[]; removed: number } => {
    let removed = 0;
    const next: CommentNode[] = [];

    for (const node of list) {
      if (node._id === commentId) {
        removed += countComments([node]);
        continue;
      }
      if (node.replies?.length) {
        const result = removeCommentFromTree(node.replies, commentId);
        if (result.removed > 0) {
          removed += result.removed;
          next.push({ ...node, replies: result.next });
        } else {
          next.push(node);
        }
      } else {
        next.push(node);
      }
    }

    return { next, removed };
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleAddComment = async () => {
    if (!presentUser) {
      toast.error("Please sign in to comment");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await backendApi.post(
        `/comments/${postId}`,
        { content: newComment },
        { headers: authHeaders }
      );
      const created: CommentNode = {
        ...res.data,
        likedBy: res.data.likedBy || [],
        dislikedBy: res.data.dislikedBy || [],
        userId:
          res.data.userId && typeof res.data.userId === "object"
            ? res.data.userId
            : {
                _id: presentUser?._id || "",
                name: presentUser?.name || "Unknown",
                profilePic: presentUser?.profilePic || "/default-profile.png",
              },
      };
      setComments((prev) => {
        const next = [...prev, { ...created, replies: [] }];
        onCountChange?.(countComments(next));
        return next;
      });
      setNewComment("");
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast.error(error?.response?.data?.message || "Unable to add comment");
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!presentUser) {
      toast.error("Please sign in to reply");
      return;
    }
    if (!content.trim()) return;

    try {
      const res = await backendApi.post(
        `/comments/reply/${parentId}`,
        { content },
        { headers: authHeaders }
      );
      const reply: CommentNode = {
        ...res.data,
        replies: [],
        likedBy: res.data.likedBy || [],
        dislikedBy: res.data.dislikedBy || [],
        userId:
          res.data.userId && typeof res.data.userId === "object"
            ? res.data.userId
            : {
                _id: presentUser?._id || "",
                name: presentUser?.name || "Unknown",
                profilePic: presentUser?.profilePic || "/default-profile.png",
              },
      };
      setComments((prev) => {
        const next = addReplyToTree(prev, parentId, reply);
        onCountChange?.(countComments(next));
        return next;
      });
    } catch (error: any) {
      console.error("Error replying to comment:", error);
      toast.error(error?.response?.data?.message || "Unable to reply");
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    if (!presentUser) {
      toast.error("Please sign in to edit");
      return;
    }
    if (!content.trim()) return;
    try {
      const res = await backendApi.put(
        `/comments/${commentId}`,
        { content },
        { headers: authHeaders }
      );
      const updated: CommentNode = res.data;
      setComments((prev) =>
        updateCommentInTree(prev, commentId, (node) => ({
          ...node,
          content: updated.content,
          updatedAt: updated.updatedAt,
        }))
      );
    } catch (error: any) {
      console.error("Error editing comment:", error);
      toast.error(error?.response?.data?.message || "Unable to edit");
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!presentUser) {
      toast.error("Please sign in to delete");
      return;
    }
    const ok = window.confirm("Delete this comment and its replies?");
    if (!ok) return;
    try {
      await backendApi.delete(`/comments/${commentId}`, {
        headers: authHeaders,
      });
      setComments((prev) => {
        const result = removeCommentFromTree(prev, commentId);
        onCountChange?.(countComments(result.next));
        return result.next;
      });
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      toast.error(error?.response?.data?.message || "Unable to delete");
    }
  };

  const handleVote = async (
    commentId: string,
    type: "upvote" | "downvote"
  ) => {
    if (!presentUser) {
      toast.error("Please sign in to vote");
      return;
    }
    try {
      const res = await backendApi.post(
        `/comments/${type}/${commentId}`,
        {},
        { headers: authHeaders }
      );
      const updated: CommentNode = {
        ...res.data,
        likedBy: res.data.likedBy || [],
        dislikedBy: res.data.dislikedBy || [],
      };
      setComments((prev) =>
        updateCommentInTree(prev, commentId, (node) => ({
          ...node,
          likes: updated.likes,
          dislikes: updated.dislikes,
          likedBy: updated.likedBy,
          dislikedBy: updated.dislikedBy,
        }))
      );
    } catch (error: any) {
      console.error("Error voting on comment:", error);
      toast.error(error?.response?.data?.message || "Unable to vote");
    }
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Add a comment..."
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Post Comment
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={presentUser?._id}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onVote={handleVote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;

