import React from "react";
import { Outlet } from "react-router";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-6 md:px-16 transition-colors duration-500">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-30 items-center justify-between">
        {/* Left Section */}
        <section className=" flex-6/10">
          <Outlet />
        </section>

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
