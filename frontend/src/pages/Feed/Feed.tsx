import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { Outlet } from "react-router";

const Feed: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </section>

      <section className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </section>

      <section>
        <Footer />
      </section>
    </div>
  );
};
export default Feed;
