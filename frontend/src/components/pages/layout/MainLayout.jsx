import { Outlet } from "react-router-dom";
import HeaderTop from "./HeaderTop";
import Navbar from "./Navbar";

function MainLayout() {
  return (
    <>
      <HeaderTop />
      <Navbar />
      <Outlet />
    </>
  );
}

export default MainLayout;