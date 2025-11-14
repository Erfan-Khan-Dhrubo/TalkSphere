import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("mongodb successfully connected!!");
  } catch (error) {
    console.log("error connecting mongodb", error);
    process.exit(1);
  }
};
