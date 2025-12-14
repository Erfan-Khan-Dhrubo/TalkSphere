import React, { useEffect, useState } from "react";
import backendApi from "../../utilities/axios";
import { Bell, X } from "lucide-react";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: string;
  userImage?: string;
  createdAt: string;
}

const AnnouncementBanner: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await backendApi.get("/announcements");
        setAnnouncements(res.data || []);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  // Get dismissed announcements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dismissedAnnouncements");
    if (saved) {
      setDismissed(JSON.parse(saved));
    }
  }, []);

  // Filter out dismissed announcements
  const activeAnnouncements = announcements.filter(
    (ann) => !dismissed.includes(ann._id)
  );

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    localStorage.setItem("dismissedAnnouncements", JSON.stringify(newDismissed));
    
    // Move to next announcement if available
    if (currentIndex < activeAnnouncements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (activeAnnouncements.length === 0) return null;

  const currentAnnouncement = activeAnnouncements[currentIndex];

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white mx-4 mb-4 rounded-lg shadow-lg">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-3 flex-1">
          <Bell className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{currentAnnouncement.title}</h3>
            <p className="text-sm text-blue-50">{currentAnnouncement.content}</p>
          </div>
        </div>
        <button
          onClick={() => handleDismiss(currentAnnouncement._id)}
          className="text-white hover:text-blue-200 transition ml-2 flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {activeAnnouncements.length > 1 && (
        <div className="flex justify-center gap-2 pb-3">
          {activeAnnouncements.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementBanner;

