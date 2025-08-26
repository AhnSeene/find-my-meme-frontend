import Navbar from "../components/common/Navbar";
import BottomNavbar from "../components/common/BottomNavbar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomNavbar />
    </>
  );
}
