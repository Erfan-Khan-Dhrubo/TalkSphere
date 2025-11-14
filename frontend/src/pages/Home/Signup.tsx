import React, { useContext, useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { AuthContext } from "../../config/AuthPorvider";

const Signup: React.FC = () => {
  // Form state with explicit types
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const { createUser, createUserWithGoogle, setUser } = useContext(AuthContext);

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  useEffect(() => {
    document.title = "TalkSphere | Signup";
  }, []);

  const validatePassword = (
    password: string,
    confirmPassword: string
  ): string | null => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const isLength = password.length >= 8;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password !== confirmPassword) return "Passwords do not match!";
    if (!hasUpper)
      return "Password must contain at least one uppercase letter.";
    if (!hasLower)
      return "Password must contain at least one lowercase letter.";
    if (!isLength) return "Password must be at least 8 characters long.";
    if (!hasSpecial)
      return "Password must contain at least one special character.";

    return null;
  };

  // Handling Signup with email
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const passwordError = validatePassword(password, confirmPassword);
    if (passwordError) {
      setSaving(false);
      setError(passwordError);
      return;
    }

    createUser(email, password)
      .then((userCredential: any) => {
        const user = userCredential.user;
        toast.success("Registration Successful!");
        setSaving(false);
      })
      .catch((error: any) => {
        toast.error("Failed to register");
        setError(error.message);
        setSaving(false);
      });
    console.log({ name, email, password, confirmPassword });
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // Handling Signup with Google
  const handleGoogleLogin = () => {
    createUserWithGoogle()
      .then((userCredential: any) => {
        const user = userCredential.user;
        toast.success("Registration Successful!");
        setUser(user);
      })
      .catch((error: any) => {
        toast.error("Google login failed.");
        setError(error.message);
      })
      .finally(() => setSaving(false));
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full font-semibold mt-2"
          >
            {saving ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="divider">OR</div>

          <button
            onClick={handleGoogleLogin}
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
