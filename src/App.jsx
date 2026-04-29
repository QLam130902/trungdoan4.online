import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import FeedbackPage from "./pages/client/FeedbackPage";
import TraditionPage from "./pages/client/TraditionPage";
import FAQPage from "./pages/client/FAQPage";
import DashboardPage from "./pages/admin/DashboardPage";
import FeedbackListPage from "./pages/admin/FeedbackListPage";
import LoginPage from "./pages/admin/LoginPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Client pages */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<FeedbackPage />} />
            <Route path="/truyen-thong" element={<TraditionPage />} />
            <Route path="/faq" element={<FAQPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin pages */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="gop-y" element={<FeedbackListPage />} />
            <Route 
              path="can-bo" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <UserManagementPage />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
