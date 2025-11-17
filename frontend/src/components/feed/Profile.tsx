import React, { useContext } from "react";
import { FaCamera } from "react-icons/fa";
import { AuthContext } from "../../config/AuthPorvider";
import Loader from "../common/Loader";
import { ThumbsDown } from "lucide-react";
import { ThumbsUp } from "lucide-react";
import { uploadToCloudinary } from "../../utilities/imageUpload";
import backendApi from "../../utilities/axios";

const Profile: React.FC = () => {
  const { presentUser, setPresentUser } = useContext(AuthContext);

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadToCloudinary(file);

    try {
      const res = await backendApi.patch(
        `/users/updateImage/${presentUser.email}`,
        { imageUrl, type }
      );

      setPresentUser(res.data.user); // full updated user object
      return res.data.user;
    } catch (err) {
      console.error(err);
    }
  };

  if (!presentUser) {
    return <Loader />;
  }
  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      {/* Cover Photo */}
      <div className="relative w-full h-60 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={presentUser.coverPic}
          alt="Cover"
          className="w-full h-full object-cover"
        />

        {/* Cover camera button (no upload) */}
        <label
          className="absolute right-4 top-4 bg-white/90 p-2 rounded-full shadow hover:scale-105 transition z-2"
          aria-label="Camera icon"
        >
          <FaCamera className="h-5 w-5" />
          <input
            type="file"
            className="hidden"
            aria-label="Upload image"
            onChange={(e) => uploadImage(e, "cover")}
          />
        </label>
      </div>

      {/* Profile Section */}
      <div className="flex items-end gap-4 -mt-16 px-4">
        {/* Profile Image */}
        <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-md bg-white">
          <img
            src={presentUser.profilePic}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />

          {/* Profile camera button  */}
          <label className="absolute right-0 bottom-0 -mb-1 -mr-1 bg-white p-2 rounded-full shadow hover:scale-105 transition cursor-pointer">
            <FaCamera className="h-5 w-5" />
            <input
              type="file"
              className="hidden"
              aria-label="Upload image"
              onChange={(e) => uploadImage(e, "profile")}
            />
          </label>
        </div>

        {/* Name and Friends */}
        <div className="pb-3">
          <h1 className="text-2xl font-semibold">{presentUser.name}</h1>
          <div className="flex py-2 justify-center items-center gap-2">
            <p className="text-gray-600 text-sm flex justify-center items-center gap-1">
              Posts: {presentUser.totalPosts.length}
            </p>
            <div className="text-gray-600 text-sm">|</div>
            <p className="text-gray-600 text-sm flex justify-center items-center gap-1">
              <ThumbsUp className="w-4 h-4 text-blue-500" />
              {presentUser.totalUpVote.length}
            </p>
            <div className="text-gray-600 text-sm">|</div>
            <p className="text-gray-600 text-sm flex justify-center items-center gap-1">
              <ThumbsDown className="w-4 h-4 text-red-500" />
              {presentUser.totalDownVote.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
