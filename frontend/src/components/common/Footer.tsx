import React from "react";
import { Link, useLocation } from "react-router";
import { Github, Linkedin, Mail, Globe } from "lucide-react";

const Footer: React.FC = () => {
  const location = useLocation();

  // Function to check if route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <footer className="w-full bg-white border-t shadow-inner mt-10 p-6 md:px-16">
      {/* Top section: Logo + Links + Social Icons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img src="/assets/logo3.png" alt="logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold">TalkSphere</h1>
        </div>

        {/* Center: Quick Links with underline for active route */}
        <div className="flex gap-8 text-gray-600 mt-4 md:mt-0">
          {[
            { name: "Newsfeed", path: "/feed" },
            { name: "Favourite", path: "/favourite" },
            { name: "My Profile", path: "/feed/profile" },
            { name: "Create Post", path: "/create-post" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative py-1 ${
                isActive(link.path) ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-600 rounded"></span>
              )}
            </Link>
          ))}
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-5 text-gray-600 mt-4 md:mt-0">
          <a href="#" className="hover:text-blue-600">
            <Github size={22} />
          </a>
          <a href="#" className="hover:text-blue-600">
            <Linkedin size={22} />
          </a>
          <a href="#" className="hover:text-blue-600">
            <Mail size={22} />
          </a>
          <a href="#" className="hover:text-blue-600">
            <Globe size={22} />
          </a>
        </div>
      </div>

      {/* Bottom section: copyright */}
      <div className="text-center text-gray-500 mt-6 text-sm">
        © {new Date().getFullYear()} TalkSphere — Empowering Learners Together.
      </div>
    </footer>
  );
};

export default Footer;
