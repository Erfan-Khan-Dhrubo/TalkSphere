import React, { useEffect, useState, useContext } from "react";
import backendApi from "../../utilities/axios";
import { AuthContext } from "../../config/AuthPorvider";
import toast from "react-hot-toast";
import { Bell, Trash2, Plus } from "lucide-react";
import CreateAnnouncement from "../../components/announcements/CreateAnnouncement";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: string;
  userImage?: string;
  createdAt: string;
  userId?: string;
}

const AllAnnouncements: React.FC = () => {
  const { presentUser } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await backendApi.get("/announcements");
      setAnnouncements(res.data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    if (!presentUser) {
      toast.error("You must be logged in");
      return;
    }

    try {
      await backendApi.delete(`/announcements/${id}`, {
        data: { userId: presentUser._id },
      });
      toast.success("Announcement deleted successfully");
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete announcement"
      );
    }
  };

  const isAdmin = presentUser?.role === "admin";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="w-8 h-8" />
          All Announcements
        </h1>
        {isAdmin && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showCreate ? "Cancel" : "Create New"}
          </button>
        )}
      </div>

      {showCreate && (
        <div className="mb-6">
          <CreateAnnouncement
            isOpen={showCreate}
            onToggle={() => setShowCreate(false)}
            onSuccess={() => {
              setShowCreate(false);
              fetchAnnouncements();
            }}
          />
        </div>
      )}

      {announcements.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No announcements yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Be the first to create an announcement!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {announcement.userImage && (
                      <img
                        src={announcement.userImage}
                        alt={announcement.author}
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-xl">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-blue-100">
                        by {announcement.author} •{" "}
                        {new Date(announcement.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-blue-50 whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="ml-4 text-white hover:text-red-200 transition p-2 rounded-lg hover:bg-white/20"
                    title="Delete announcement"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAnnouncements;
