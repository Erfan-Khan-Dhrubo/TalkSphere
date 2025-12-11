import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { uploadToCloudinary } from "../../utilities/imageUpload";
import Preview from "../../components/feed/createPost/Preview";

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [loading, setLoading] = useState(false);

  // HANDLE FILE UPLOAD
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const url = await uploadToCloudinary(file);
    setImage(url);
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-6 md:px-16 py-16 text-base-content">
      <div className="max-w-2xl mx-auto bg-base-100 border border-primary px-6 py-12 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create a Post
        </h2>

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

          {loading && <p className="text-sm text-primary mt-2">Uploading...</p>}

          {image && !loading && (
            <img
              src={image}
              alt="Preview"
              className="w-full rounded-lg mt-3 border"
            />
          )}
        </div>

        {/* PREVIEW BUTTON */}
        <button
          className="btn btn-secondary w-full font-semibold mt-4"
          onClick={() => setPreviewOpen(true)}
        >
          Preview Post
        </button>
        {/* POST BUTTON */}
        <button className="btn w-full font-semibold mt-4 bg-primary text-white hover:bg-primary-focus active:scale-95 transition transform shadow-lg rounded-lg py-3">
          POST
        </button>
      </div>

      {/* PREVIEW MODAL */}
      {previewOpen && (
        <Preview
          title={title}
          content={content}
          image={image}
          showFullText={showFullText}
          setShowFullText={setShowFullText}
          setPreviewOpen={setPreviewOpen}
        />
      )}
    </div>
  );
};

export default CreatePost;
