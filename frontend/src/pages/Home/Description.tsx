import React from "react";
import { useNavigate } from "react-router";

const Description: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Empowering Students Through Shared Knowledge.
      </h1>

      <p className="text-lg opacity-90">
        <span className="font-bold">TalkSphere</span> is an interactive platform
        where students review courses and faculty, rate learning experiences,
        and share study resources. Join a community built for collaboration,
        academic insight, and smarter decisions.
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
  );
};
export default Description;
