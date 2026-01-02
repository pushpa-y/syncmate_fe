import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiBarChart2,
  FiSettings,
  FiSun,
  FiMoon,
  FiUser,
  FiLayers,
  FiLogOut,
} from "react-icons/fi";
import { useContext, useState } from "react";
import { useTheme } from "../context/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";
import { useSidebar } from "../context/SidebarContext";
import {
  Aside,
  Nav,
  NavItemLink,
  NavItemButton,
  FooterRow,
} from "../styles/Sidebar";

const NAV_ITEMS = [
  { to: "/dashboard", icon: FiHome, label: "Dashboard" },
  { to: "/accounts", icon: FiLayers, label: "Accounts" },
  { to: "/analytics", icon: FiBarChart2, label: "Analytics" },
];

export default function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleNavAction = (path?: string) => {
    if (path) navigate(path);
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  };

  const handleLogout = () => {
    auth?.logout?.();
    handleNavAction("/");
  };

  return (
    <Aside
      $collapsed={collapsed}
      initial={false}
      animate={window.innerWidth > 768 ? { width: collapsed ? 80 : 260 } : {}}
      transition={{
        type: "spring",
        stiffness: 400, // Higher = faster snap
        damping: 40, // Higher = less "bounce"
        mass: 1,
      }}
    >
      <Nav>
        {/* User Profile Info */}
        <NavItemLink
          to="/profile"
          $collapsed={collapsed}
          onClick={() => handleNavAction()}
        >
          <FiUser size={20} />
          <span className="label">{auth?.user?.name || "User"}</span>
        </NavItemLink>

        {/* Navigation Links */}
        {NAV_ITEMS.map((item) => (
          <NavItemLink
            key={item.to}
            to={item.to}
            end
            $collapsed={collapsed}
            onClick={() => handleNavAction()}
          >
            <item.icon size={20} />
            <span className="label">{item.label}</span>
          </NavItemLink>
        ))}

        {/* Settings Action */}
        <NavItemButton
          $collapsed={collapsed}
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <FiSettings size={20} />
          <span className="label">Settings</span>
        </NavItemButton>

        <AnimatePresence>
          {!collapsed && settingsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden", paddingLeft: 44 }}
            >
              <div
                onClick={handleLogout}
                style={{
                  color: "#ef4444",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 0",
                }}
              >
                <FiLogOut size={14} /> Logout
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Nav>

      <FooterRow $collapsed={collapsed}>
        <div className="theme-toggle" onClick={toggle} role="button">
          {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
          {!collapsed && (
            <span className="label">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          )}
        </div>
        {/*!collapsed && <p className="version">v1.0 • built with ♥</p>*/}
      </FooterRow>
    </Aside>
  );
}
