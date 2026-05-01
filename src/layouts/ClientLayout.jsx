import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WelcomeModal from "../components/WelcomeModal";
import "./ClientLayout.css";

export default function ClientLayout() {
  return (
    <div className="client-layout">
      <Header />
      <main className="client-main">
        <div className="client-content">
          <Outlet />
        </div>
      </main>
      <Footer />
      <WelcomeModal />
    </div>
  );
}
