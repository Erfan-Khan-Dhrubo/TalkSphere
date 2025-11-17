import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../config/AuthPorvider";
import { Navigate, useLocation } from "react-router";
import Loader from "../components/common/Loader";
import Swal from "sweetalert2";

interface PrivateProps {
  children: React.ReactNode;
}

const PrivateRoutes: React.FC<PrivateProps> = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!loading && !user?.email) {
      Swal.fire({
        title: "Access Denied",
        text: "You need to login first to view this page!",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        setShowAlert(true);
      });
    }
  }, [loading, user]);

  if (loading) return <Loader />;

  if (user?.email) return children;

  if (showAlert) {
    return (
      <Navigate to="/signup" replace state={{ from: location.pathname }} />
    );
  }

  return null;
};

export default PrivateRoutes;
