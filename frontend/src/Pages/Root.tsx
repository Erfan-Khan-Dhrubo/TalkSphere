import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Root: React.FC = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Root;
