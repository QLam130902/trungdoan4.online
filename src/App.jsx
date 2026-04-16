import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import FeedbackPage from "./pages/client/FeedbackPage";
import TraditionPage from "./pages/client/TraditionPage";
import FAQPage from "./pages/client/FAQPage";
import DashboardPage from "./pages/admin/DashboardPage";
import FeedbackListPage from "./pages/admin/FeedbackListPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Client pages */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<FeedbackPage />} />
          <Route path="/truyen-thong" element={<TraditionPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>

        {/* Admin pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="gop-y" element={<FeedbackListPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
