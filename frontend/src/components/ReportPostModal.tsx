import React, { useState } from "react";
import backendApi from "../utilities/axios";

interface ReportPostModalProps {
  postId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const reasons = [
  "Spam",
  "Offensive content",
  "Misleading information",
  "Fake info",
  "Harassment",
  "Other",
];

const ReportPostModal: React.FC<ReportPostModalProps> = ({
  postId,
  open,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    if (!reason.trim()) {
      setError("Please select a reason.");
      return;
    }

    try {
      setSubmitting(true);
      await backendApi.post(`/reports/post/${postId}`, {
        reason,
        description,
      });
      setSuccess("Report submitted successfully");
      onSuccess?.();
      setTimeout(() => {
        setReason("");
        setDescription("");
        setSuccess(null);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to submit report. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md mx-4 rounded-xl shadow-2xl p-6 transform transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Report Post</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a reason</option>
          {reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add details if needed"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPostModal;

