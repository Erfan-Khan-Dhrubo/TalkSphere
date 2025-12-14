import React, { useState, useContext } from "react";
import backendApi from "../../utilities/axios";
import { AuthContext } from "../../config/AuthPorvider";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

interface CreateAnnouncementProps {
  onSuccess?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const CreateAnnouncement: React.FC<CreateAnnouncementProps> = ({
  onSuccess,
  isOpen: externalIsOpen,
  onToggle,
}) => {
  const { presentUser } = useContext(AuthContext);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onToggle || setInternalIsOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    if (!presentUser) {
      toast.error("You must be logged in");
      return;
    }

    try {
      setSubmitting(true);
      await backendApi.post("/announcements", {
        userId: presentUser._id,
        title: title.trim(),
        content: content.trim(),
        author: presentUser.name || "Admin",
        userImage: presentUser.profilePic || null,
      });

      toast.success("Announcement created successfully");
      setTitle("");
      setContent("");
      setIsOpen(false);
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Fallback: refresh page to show new announcement
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create announcement");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="max-w-2xl mx-auto mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Plus className="w-5 h-5" />
          Create Announcement
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mb-4 bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4">Create Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter announcement title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter announcement content"
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Announcement"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setTitle("");
              setContent("");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAnnouncement;

