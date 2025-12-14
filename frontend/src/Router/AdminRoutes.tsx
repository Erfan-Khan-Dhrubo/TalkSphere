import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../config/AuthPorvider";
import { Navigate } from "react-router";
import Loader from "../components/common/Loader";
import Swal from "sweetalert2";

interface AdminRoutesProps {
  children: React.ReactNode;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ children }) => {
  const { presentUser, loading, user } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!loading && (!user?.email || !presentUser)) {
      Swal.fire({
        title: "Access Denied",
        text: "You need to login first to view this page!",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        setShowAlert(true);
      });
    } else if (!loading && presentUser && presentUser.role !== "admin") {
      Swal.fire({
        title: "Access Denied",
        text: "You need admin privileges to access this page!",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        setShowAlert(true);
      });
    }
  }, [loading, user, presentUser]);

  if (loading) return <Loader />;

  if (user?.email && presentUser?.role === "admin") {
    return <>{children}</>;
  }

  if (showAlert) {
    return <Navigate to="/feed" />;
  }

  return null;
};

export default AdminRoutes;

