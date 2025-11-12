import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [showForgot, setShowForgot] = useState<boolean>(false);

  // Type the event as FormEvent<HTMLFormElement>
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
    setEmail("");
    setPassword("");
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Forgot Password Email:", forgotEmail);
    setForgotEmail("");
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-6 md:px-16 transition-colors duration-500 py-12">
      <div className="bg-transparent border border-primary rounded-2xl p-8 md:p-10 w-full max-w-md shadow-lg backdrop-blur-md">
        {!showForgot ? (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Log In to TalkSphere
            </h2>

            <form className="space-y-5" onSubmit={handleLogin}>
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

              {/* Forgot Password */}
              <div className="text-right text-sm">
                <button
                  type="button"
                  className="link link-hover text-primary"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full font-semibold mt-2"
              >
                Log In
              </button>

              <div className="divider">OR</div>

              <button
                type="button"
                className="btn btn-outline btn-secondary w-full font-semibold"
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
              Don't have an account?{" "}
              <Link
                to={"/signup"}
                className="link link-hover text-primary font-medium"
              >
                Sign Up
              </Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Reset Password
            </h2>
            <form className="space-y-5" onSubmit={handleForgotPassword}>
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full bg-base-100/50 text-base-content"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full font-semibold mt-2"
              >
                Send Reset Link
              </button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  className="link link-hover text-primary"
                  onClick={() => setShowForgot(false)}
                >
                  Back to Log In
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
