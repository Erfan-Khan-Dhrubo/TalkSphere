import React, { useContext, useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../config/AuthPorvider";
import { signOut, getAuth } from "firebase/auth";
import app from "../../config/firebase.config";
import toast from "react-hot-toast";
import backendApi from "../../utilities/axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [showForgot, setShowForgot] = useState<boolean>(false);
  const {
    signIn,
    setPresentUser,
    createUserWithGoogle,
    forgetPassword,
    presentUser,
  } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (presentUser) {
      toast.success("You are already login");
      navigate("/feed");
    }
  }, [presentUser]);

  const auth = getAuth(app);

  // Type the event as FormEvent<HTMLFormElement>
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signIn(email, password);
      const user = userCredential.user;

      // Check if user is banned before proceeding
      try {
        const res = await backendApi.get(`/users/email/${user.email}`);
        const userData = res.data;

        if (userData?.isBanned) {
          // Sign out the user immediately
          await signOut(auth);
          toast.error("Your account has been banned. You cannot access this platform.");
          setEmail("");
          setPassword("");
          setLoading(false);
          return;
        }

        toast.success("Login Successful");
        setPresentUser(userData);

        // After success
        setEmail("");
        setPassword("");

        navigate("/feed");
      } catch (userErr: any) {
        if (userErr?.response?.status === 404) {
          // User not found in backend, still allow login
          toast.success("Login Successful");
          setPresentUser(user);
          setEmail("");
          setPassword("");
          navigate("/feed");
        } else {
          // If there's an error checking user, still sign out to be safe
          await signOut(auth);
          throw userErr;
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Login Failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential: any = await createUserWithGoogle();
      const user = userCredential.user;

      // Check if user is banned
      try {
        const res = await backendApi.get(`/users/email/${user.email}`);
        const userData = res.data;

        if (userData?.isBanned) {
          await signOut(auth);
          toast.error("Your account has been banned. You cannot access this platform.");
          return;
        }

        setPresentUser(userData);
        toast.success("Login Successful");
        navigate("/feed");
      } catch (userErr: any) {
        if (userErr?.response?.status === 404) {
          // User not found in backend, still allow login
          setPresentUser(userCredential.user);
          toast.success("Login Successful");
          navigate("/feed");
        } else {
          await signOut(auth);
          throw userErr;
        }
      }
    } catch (err) {
      toast.error("Google Login Failed");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgetPassword(forgotEmail);
      toast.success("Password reset email sent! Check your inbox.");
      setForgotEmail("");
    } catch (error) {
      toast.error("Failed to send reset email. Please check your address.");
    }
    setShowForgot(false);
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
                disabled={loading}
              >
                {loading ? "Logging in" : "Log in"}
              </button>

              <div className="divider">OR</div>

              <button
                onClick={handleGoogleLogin}
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
