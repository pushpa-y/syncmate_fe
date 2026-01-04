import React from "react";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./redux/store";

import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider } from "./context/Authcontext";
import { AccountsProvider } from "./context/AccountsContext";
import { SidebarProvider } from "./context/SidebarContext";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AccountsPage from "./pages/AccountsPage";
import Analytics from "./pages/Analytics";
import AppLayout from "./layouts/AppLayout";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 1. Wrap everything in the Redux Provider */}
    <Provider store={store}>
      <ThemeProvider>
        <SidebarProvider>
          <AuthProvider>
            <AccountsProvider>
              <Toaster position="top-center" reverseOrder={false} />

              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/accounts" element={<AccountsPage />} />
                    <Route path="/analytics" element={<Analytics />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </AccountsProvider>
          </AuthProvider>
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
