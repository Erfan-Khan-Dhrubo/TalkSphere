import React, { useEffect, useState } from "react";
import backendApi from "../../utilities/axios";
import toast from "react-hot-toast";
import { Trash2, Ban, CheckCircle, MessageSquare, FileText } from "lucide-react";

interface Report {
  _id: string;
  postId?: {
    _id: string;
    title: string;
    content: string;
    author: string;
    userId?: {
      _id: string;
      name: string;
      profilePic?: string;
    };
    createdAt: string;
  };
  commentId?: {
    _id: string;
    content: string;
    userId?: {
      _id: string;
      name: string;
      profilePic?: string;
    };
    createdAt: string;
  };
  reason: string;
  description: string;
  createdAt: string;
  status: string;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await backendApi.get("/reports");
      setReports(res.data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await backendApi.delete(`/reports/post/${postId}`);
      toast.success("Post deleted successfully");
      fetchReports();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete post");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await backendApi.delete(`/reports/comment/${commentId}`);
      toast.success("Comment deleted successfully");
      fetchReports();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!confirm("Are you sure you want to ban this user?")) return;

    try {
      await backendApi.patch(`/reports/user/${userId}/ban`);
      toast.success("User banned successfully");
      fetchReports();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to ban user");
    }
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      await backendApi.patch(`/reports/${reportId}/resolve`);
      toast.success("Report resolved");
      fetchReports();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to resolve report");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reports Moderation Panel</h1>

      {reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No pending reports</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
            >
              {/* Report Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {report.postId ? (
                    <FileText className="w-5 h-5 text-blue-500" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {report.postId ? "Post Report" : "Comment Report"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {report.status}
                </span>
              </div>

              {/* Reason and Description */}
              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-1">
                  Reason: <span className="text-red-600">{report.reason}</span>
                </p>
                {report.description && (
                  <p className="text-sm text-gray-600 mt-2">{report.description}</p>
                )}
              </div>

              {/* Reported Content */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                {report.postId ? (
                  <div>
                    {(report.postId as any).deleted ? (
                      <p className="text-red-600 font-semibold">
                        Post has been deleted
                      </p>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-800 mb-2">
                          Post Title: {report.postId.title}
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {report.postId.content?.substring(0, 200)}
                          {report.postId.content?.length > 200 && "..."}
                        </p>
                        {report.postId.userId && (
                          <div className="flex items-center gap-2 mt-3">
                            <img
                              src={
                                report.postId.userId.profilePic ||
                                "/default-profile.png"
                              }
                              alt={report.postId.userId.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm text-gray-600">
                              By: {report.postId.userId.name}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : report.commentId ? (
                  <div>
                    {(report.commentId as any).deleted ? (
                      <p className="text-red-600 font-semibold">
                        Comment has been deleted
                      </p>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-800 mb-2">Comment:</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {report.commentId.content}
                        </p>
                        {report.commentId.userId && (
                          <div className="flex items-center gap-2 mt-3">
                            <img
                              src={
                                report.commentId.userId.profilePic ||
                                "/default-profile.png"
                              }
                              alt={report.commentId.userId.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm text-gray-600">
                              By: {report.commentId.userId.name}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {report.postId && !(report.postId as any).deleted && (
                  <>
                    <button
                      onClick={() => handleDeletePost(report.postId!._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Post
                    </button>
                    {report.postId.userId && (
                      <button
                        onClick={() => handleBanUser(report.postId!.userId!._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                      >
                        <Ban className="w-4 h-4" />
                        Ban User
                      </button>
                    )}
                  </>
                )}

                {report.commentId && !(report.commentId as any).deleted && (
                  <>
                    <button
                      onClick={() => handleDeleteComment(report.commentId!._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Comment
                    </button>
                    {report.commentId.userId && (
                      <button
                        onClick={() => handleBanUser(report.commentId!.userId!._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                      >
                        <Ban className="w-4 h-4" />
                        Ban User
                      </button>
                    )}
                  </>
                )}

                <button
                  onClick={() => handleResolveReport(report._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition ml-auto"
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolve Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;

