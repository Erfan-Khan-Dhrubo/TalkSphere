import React from "react";
import { useNavigate } from "react-router";

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-6 md:px-16 transition-colors duration-500">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-30 items-center justify-between">
        {/* Left Section */}
        <div className="space-y-6 flex-6/10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Empowering Students Through Shared Knowledge.
          </h1>

          <p className="text-lg opacity-90">
            TalkSphere is an interactive platform where students review courses
            and faculty, rate learning experiences, and share study resources.
            Join a community built for collaboration, academic insight, and
            smarter decisions.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate("/signup")}
              className="btn btn-primary rounded-lg px-8 text-lg font-semibold"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-secondary btn-outline rounded-lg px-8 text-lg font-semibold"
            >
              Log In
            </button>
          </div>
        </div>

        {/* Right Section - Logo */}
        <div className="flex justify-center items-center flex-4/10">
          <img
            src="/assets/logo2.png"
            alt="TalkSphere Logo"
            className="w-56 h-56 md:w-90 md:h-90 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
