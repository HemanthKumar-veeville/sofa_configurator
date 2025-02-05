import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "../NavBar/TopNav";
import BottomNav from "../NavBar/BottomNav";
import WitturLogo from "../../assets/WitturLogo.svg";

function MainLayout() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ position: "relative" }}>
          <img
            src={WitturLogo}
            alt="Wittur Logo"
            style={{
              position: "absolute",
              left: "2rem",
              top: "50%",
              transform: "translateY(-50%)",
              height: "60px",
              zIndex: 1,
            }}
          />
          <TopNav />
          <BottomNav />
        </div>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
