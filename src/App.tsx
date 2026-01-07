/* eslint-disable react-refresh/only-export-components */
import React, { useContext } from "react";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./redux/store";

import { ThemeProvider } from "./context/ThemeProvider";
import { AuthContext, AuthProvider } from "./context/Authcontext";
import { SidebarProvider } from "./context/SidebarContext";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EntriesPage from "./pages/EntriesPage";
import Profile from "./pages/Profile";
import AccountsPage from "./pages/AccountsPage";
import Analytics from "./pages/Analytics";
import AppLayout from "./layouts/AppLayout";

const AppContent = () => {
  const auth = useContext(AuthContext);

  if (auth?.loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8fafc",
        }}
      >
        <h2>Loading your session...</h2>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            auth?.token ? <Navigate to="/dashboard" replace /> : <Home />
          }
        />

        {/* Protected Routes */}
        <Route
          element={auth?.token ? <AppLayout /> : <Navigate to="/" replace />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/entries" element={<EntriesPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* Catch-all: Redirect unknown paths to home/dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <SidebarProvider>
          <AuthProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <AppContent />
          </AuthProvider>
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
