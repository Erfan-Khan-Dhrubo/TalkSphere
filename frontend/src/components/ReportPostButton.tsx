import React, { useState } from "react";
import ReportPostModal from "./ReportPostModal";

interface ReportPostButtonProps {
  postId: string;
}

const ReportPostButton: React.FC<ReportPostButtonProps> = ({ postId }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="text-sm text-red-500 hover:text-red-600 font-semibold"
      >
        Report
      </button>
      <ReportPostModal
        postId={postId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default ReportPostButton;

