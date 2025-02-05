import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/Layout/MainLayout";
import Configurator from "./pages/Configurator";
import WhoWeAre from "./pages/WhoWeAre";
import SupplierWorld from "./pages/SupplierWorld";
import BuyerWorld from "./pages/BuyerWorld";
import CustomerPortal from "./pages/CustomerPortal";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="who-we-are" element={<WhoWeAre />} />
          <Route path="supplier-world" element={<SupplierWorld />} />
          <Route path="buyer-world" element={<BuyerWorld />} />
          <Route path="customer-portal" element={<CustomerPortal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
// configurator
export default App;
