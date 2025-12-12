import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { FaCamera } from "react-icons/fa";
import { uploadToCloudinary } from "../../utilities/imageUpload";
import backendApi from "../../utilities/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../config/AuthPorvider";

interface PostType {
  _id: string;
  title: string;
  content: string;
  image?: string;
}

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { presentUser } = useContext(AuthContext);

  const [post, setPost] = useState<PostType | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true); // for fetching post
  const [uploading, setUploading] = useState<boolean>(false); // for image upload
  const [saving, setSaving] = useState<boolean>(false); // for saving post

  // Fetch post by ID
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await backendApi.get<PostType>(`/posts/${id}`);
        setPost(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
        setImage(res.data.image || null);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Handle image upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImage(url);
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Handle post update
  const handleSave = async () => {
    if (!title || !content) {
      toast.error("Title and content cannot be empty");
      return;
    }

    if (!post) return;

    setSaving(true);
    try {
      const res = await backendApi.patch(`/posts/${post._id}`, {
        title,
        content,
        image,
      });

      if (res.status === 200) {
        toast.success("Post updated successfully!");
        navigate(`/feed/postDetails/${post._id}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center mt-10 text-red-500">Post not found</div>;
  }

  return (
    <div className="min-h-screen px-6 md:px-16 py-16 text-base-content">
      <div className="max-w-2xl mx-auto bg-base-100 border border-primary px-6 py-12 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Post</h2>

        {/* TITLE */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            placeholder="Post Title..."
            className="input input-bordered w-full bg-base-100/50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* CONTENT */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Content</label>
          <textarea
            placeholder="Write something..."
            className="textarea textarea-bordered w-full bg-base-100/50 h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="relative w-full mb-4">
          <label className="cursor-pointer inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-focus transition">
            <FaCamera /> Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {uploading && (
            <p className="text-sm text-primary mt-2">Uploading...</p>
          )}

          {image && !uploading && (
            <img
              src={image}
              alt="Preview"
              className="w-full rounded-lg mt-3 border"
            />
          )}
        </div>

        {/* SAVE BUTTON */}
        <button
          disabled={saving}
          onClick={handleSave}
          className="btn w-full font-semibold mt-4 bg-primary text-white hover:bg-primary-focus active:scale-95 transition transform shadow-lg rounded-lg py-3"
        >
          {saving ? "Saving..." : "Update Post"}
        </button>
      </div>
    </div>
  );
};

export default EditPost;
