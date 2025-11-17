import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import app from "./firebase.config";
import backendApi from "../utilities/axios";

export const AuthContext = createContext<any>(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [presentUser, setPresentUser] = useState<User | null>(null);

  // Create user (email + password)
  const createUser = (email: string, password: string) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Google Sign in
  const createUserWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      const fetchNote = async () => {
        try {
          const res = await backendApi.get(
            `/users/email/${currentUser?.email}`
          ); // This sends a GET request to backend.
          setPresentUser(res.data);
        } catch (error) {
          console.log("Error in fetching note", error);
        }
      };
      fetchNote();
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Logout
  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Email Sign in
  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Update profile
  const updateUser = (updateData: {
    displayName?: string;
    photoURL?: string;
  }) => {
    return updateProfile(auth.currentUser!, updateData);
  };

  // Forget password
  const forgetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const authData = {
    user,
    setUser,
    createUser,
    logout,
    signIn,
    loading,
    setLoading,
    updateUser,
    createUserWithGoogle,
    forgetPassword,
    presentUser,
    setPresentUser,
  };

  return <AuthContext value={authData}>{children}</AuthContext>;
};

export default AuthProvider;
