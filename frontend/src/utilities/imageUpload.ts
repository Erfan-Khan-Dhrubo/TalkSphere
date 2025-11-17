import axios from "axios";

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file); // the file itself
  formData.append("upload_preset", import.meta.env.VITE_upload_preset); // unsigned preset
  formData.append("cloud_name", import.meta.env.VITE_cloud_name);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_cloud_name
      }/image/upload`,
      formData
    );

    // Cloudinary returns secure_url
    return res.data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null;
  }
};
