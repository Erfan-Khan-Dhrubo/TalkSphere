import React from "react";
import { IoClose } from "react-icons/io5";

interface PreviewProps {
  title: string;
  content: string;
  image: string | null;
  showFullText: boolean;
  setShowFullText: React.Dispatch<React.SetStateAction<boolean>>;
  setPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Preview: React.FC<PreviewProps> = ({
  title,
  content,
  image,
  showFullText,
  setShowFullText,
  setPreviewOpen,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 overflow-auto">
      <div className="bg-base-100 w-full max-w-lg rounded-xl shadow-xl p-6 relative border border-primary max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          className="absolute right-4 top-4 text-xl"
          onClick={() => {
            setPreviewOpen(false);
            setShowFullText(false);
          }}
        >
          <IoClose />
        </button>

        <h3 className="text-xl font-semibold mb-2">
          {title || "Untitled Post"}
        </h3>

        {/* TEXT AREA */}
        <div className="mb-3">
          <p
            className={`whitespace-pre-wrap transition-all duration-300 ${
              showFullText ? "line-clamp-none" : "line-clamp-3"
            }`}
          >
            {content || "No content provided."}
          </p>

          {content.length > 120 && (
            <button
              className="text-primary font-semibold text-sm mt-1"
              onClick={() => setShowFullText(!showFullText)}
            >
              {showFullText ? "See less" : "See more"}
            </button>
          )}
        </div>

        {/* IMAGE */}
        {image && (
          <img
            src={image}
            alt="Post preview"
            className="w-full rounded-lg border mt-3"
          />
        )}
      </div>
    </div>
  );
};

export default Preview;
