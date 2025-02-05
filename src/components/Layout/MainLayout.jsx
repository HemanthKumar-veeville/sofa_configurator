import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "../NavBar/TopNav";
import BottomNav from "../NavBar/BottomNav";
import WitturLogo from "../../assets/WitturLogo.svg";

function MainLayout() {
  return (
    <div className="app-container">
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
