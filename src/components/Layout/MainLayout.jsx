import React from "react";
import { Outlet } from "react-router-dom";

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
