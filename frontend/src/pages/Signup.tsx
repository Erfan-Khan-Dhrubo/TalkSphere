import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router";

const Signup: React.FC = () => {
  // Form state with explicit types
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // Placeholder function for Sign Up
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, password, confirmPassword });
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-6 md:px-16 transition-colors duration-500 py-12">
      <div className="bg-transparent border border-primary rounded-2xl p-8 md:p-10 w-full max-w-md shadow-lg backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Sign Up for TalkSphere
        </h2>

        <form className="space-y-5" onSubmit={handleSignup}>
          {/* Name */}
          <div>
            <label className="block mb-2 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full bg-base-100/50 text-base-content"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full bg-base-100/50 text-base-content"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-2 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="input input-bordered w-full pr-10 bg-base-100/50 text-base-content"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-xl opacity-60 hover:opacity-100"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block mb-2 font-medium">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="input input-bordered w-full pr-10 bg-base-100/50 text-base-content"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-xl opacity-60 hover:opacity-100"
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full font-semibold mt-2"
          >
            Sign Up
          </button>

          <div className="divider">OR</div>

          <button
            type="button"
            className="btn btn-outline btn-secondary w-full font-semibold flex items-center justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="link link-hover text-primary font-medium"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
