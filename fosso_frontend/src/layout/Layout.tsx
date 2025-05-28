import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
