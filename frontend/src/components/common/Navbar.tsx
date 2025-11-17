import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Home, Star, User, PlusSquare } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { AuthContext } from "../../config/AuthPorvider";
import toast from "react-hot-toast";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { presentUser, logout } = useContext(AuthContext);

  if (!presentUser) {
    return (
      <div className="flex justify-center items-center min-h-16 bg-white shadow-md">
        <span className="loading loading-spinner loading-md text-blue-500"></span>
      </div>
    );
  }

  const onLogout = () => {
    logout()
      .then(() => toast.success("Logout successful!"))
      .catch(() => toast.error("Logout failed!"));
  };

  return (
    <nav className="w-full bg-white shadow-md px-10 py-3 ">
      {/* ------------ DESKTOP NAVBAR (md and up) ------------ */}
      <div className="hidden md:flex justify-between items-center">
        {/* LEFT LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/assets/logo3.png" alt="logo" className="w-9 h-9" />
          <h1 className="text-xl font-bold">TalkSphere</h1>
        </div>

        {/* CENTER ROUTES */}
        <div className="flex items-center gap-8">
          <NavLink
            to="/feed"
            end
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-500"
            }
            data-tooltip-id="tooltip-home"
          >
            <Home className="w-6 h-6" />
          </NavLink>

          <Tooltip id="tooltip-home" place="top" content="Home" />

          <NavLink
            to="/favourite"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-500"
            }
            data-tooltip-id="tooltip-favourite"
          >
            <Star className="w-6 h-6" />
          </NavLink>

          <Tooltip id="tooltip-favourite" place="top" content="Favourite" />

          <NavLink
            to="/feed/profile"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-500"
            }
            data-tooltip-id="tooltip-profile"
          >
            <User className="w-6 h-6" />
          </NavLink>

          <Tooltip id="tooltip-profile" place="top" content="Profile" />

          <NavLink
            to="/create-post"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-500"
            }
            data-tooltip-id="tooltip-create"
          >
            <PlusSquare className="w-6 h-6" />
          </NavLink>

          <Tooltip id="tooltip-create" place="top" content="Create Post" />
        </div>

        {/* RIGHT PROFILE */}
        <div className="relative">
          <img
            onClick={() => setMenuOpen(!menuOpen)}
            //src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            src={presentUser.profilePic}
            className="w-10 h-10 rounded-full cursor-pointer border"
          />

          {/* DROPDOWN */}
          {menuOpen && (
            <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg py-2 w-40">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ------------ MOBILE NAVBAR (< md) ------------ */}
      <div className="md:hidden flex flex-col gap-3">
        {/* ROW 1: Logo + Profile Image */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/assets/logo3.png" alt="logo" className="w-8 h-8" />
            <h1 className="text-lg font-semibold">TalkSphere</h1>
          </div>

          {/* Profile Image */}
          <div className="relative">
            <img
              onClick={() => setMenuOpen(!menuOpen)}
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              className="w-9 h-9 rounded-full cursor-pointer border"
            />

            {menuOpen && (
              <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg py-2 w-36">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ROW 2: ROUTE ICONS */}
        <div className="flex justify-between items-center px-4 pt-2">
          <NavLink
            to="/newsfeed"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-500"
            }
          >
            <Home className="w-7 h-7" />
          </NavLink>

          <NavLink
            to="/favourite"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-500"
            }
          >
            <Star className="w-7 h-7" />
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-500"
            }
          >
            <User className="w-7 h-7" />
          </NavLink>

          <NavLink
            to="/create-post"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-500"
            }
          >
            <PlusSquare className="w-7 h-7" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
