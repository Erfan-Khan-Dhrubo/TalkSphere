import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaBookmark,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import backendApi from "../../utilities/axios";
import { AuthContext } from "../../config/AuthPorvider";
import toast from "react-hot-toast";
import VoteDownvoteButton from "./../../components/feed/newsFeed/VoteDownvoteButton";
import CommentSection from "../../components/Comment/CommentSection";

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

interface UserType {
  _id: string;
  name: string;
  savedPosts: string[];
}

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { presentUser } = useContext(AuthContext) as { presentUser: UserType };

  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const commentSectionRef = useRef<HTMLDivElement | null>(null);

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await backendApi.get<PostType>(`/posts/${id}`);
        setPost((prev) => {
          const existingCount = prev?.commentCount;
          return {
            ...res.data,
            // preserve a previously computed comment count if we already fetched it
            commentCount:
              existingCount !== undefined ? existingCount : res.data.commentCount ?? 0,
          };
        });

        if (presentUser?.savedPosts?.includes(res.data._id)) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, presentUser]);

  // Toggle favorite
  const toggleFavorite = async () => {
    if (!post || !presentUser) return;

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

        if (action === "add") {
          presentUser.savedPosts.push(post._id);
        } else {
          presentUser.savedPosts = presentUser.savedPosts.filter(
            (pid) => pid !== post._id
          );
        }
      }
    } catch (error) {
      console.error("Favorite update failed:", error);
    }
  };

  // Delete post
  const handleDelete = async () => {
    if (!post) return;

    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmDelete) return;

      // Call the delete API
      const res = await backendApi.delete(`/posts/${post._id}`);

      if (res.status === 200) {
        toast.success("Post deleted successfully!");
        navigate("/feed"); // redirect to feed or posts page
      }
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error?.response?.data?.message || "Failed to delete post");
    }
  };

  // Edit post
  const handleEdit = () => {
    if (!post) return;
    navigate(`/feed/editPost/${post._id}`);
  };

  // Fetch comment count upfront so the badge is accurate before opening section
  useEffect(() => {
    const fetchCount = async () => {
      if (!id) return;
      try {
        const res = await backendApi.get(`/comments/${id}`);
        const list = res.data as any[];
        const countNested = (nodes: any[]): number =>
          nodes.reduce(
            (acc, n) => acc + 1 + (n.replies ? countNested(n.replies) : 0),
            0
          );
        const total = countNested(list || []);
        setPost((prev) => (prev ? { ...prev, commentCount: total } : prev));
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };
    fetchCount();
  }, [id]);

  const handleShowComments = () => {
    setShowComments(true);
    // Scroll smoothly to comment section when it appears
    setTimeout(() => {
      commentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleCommentCountChange = (count: number) => {
    setPost((prev) => (prev ? { ...prev, commentCount: count } : prev));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading post...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Post not found.
      </div>
    );
  }

  const isAuthor = presentUser?.name === post.author;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white border border-gray-300 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <img
          src={post.userImage || "/default-profile.png"}
          alt={post.author}
          className="w-12 h-12 rounded-full mr-3"
        />

        <div>
          <p
            className="font-semibold hover:text-blue-600 cursor-pointer"
            onClick={() => navigate(`/user/${post.userId}`)}
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
            size={22}
            className={isFavorite ? "text-blue-600" : "text-gray-400"}
          />
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-3">{post.title}</h1>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full rounded-md mb-4 max-h-[380px] object-cover"
        />
      )}

      {/* Content */}
      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-8">
        {post.content}
      </p>

      {/* Edit/Delete buttons */}
      {isAuthor && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <FaTrash /> Delete
          </button>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t pt-4 cursor-pointer">
        <VoteDownvoteButton
          postId={post._id}
          upVotes={post.upVotes as unknown as string[]} // cast to string array
          downVotes={post.downVotes as unknown as string[]}
        />

        <button
          onClick={handleShowComments}
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
        >
          <FaComment /> {post.commentCount} Comments
        </button>
      </div>

      <div ref={commentSectionRef}>
        {showComments && (
          <CommentSection
            postId={post._id}
            onCountChange={handleCommentCountChange}
          />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
