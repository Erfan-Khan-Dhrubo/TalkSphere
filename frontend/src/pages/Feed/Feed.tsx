import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { Outlet } from "react-router";

const Feed: React.FC = () => {
  return (
    <div>
      <section>
        <Navbar />
      </section>

      <section>
        <Outlet />
      </section>

      <section>
        <Footer />
      </section>
    </div>
  );
};
export default Feed;
