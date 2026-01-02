import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/Headerbar";
import styled from "styled-components";
import { useSidebar } from "../context/SidebarContext";

const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const Main = styled.div<{ $collapsed: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  transition: margin-left 0.3s ease-in-out;
  margin-left: ${(p) => (p.$collapsed ? "96px" : "260px")};

  @media (max-width: 768px) {
    margin-left: 0; /* Mobile: Content takes full screen */
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: ${(p) => p.theme.bg || "#f8fafc"};

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const MobileOverlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 998; /* Just below sidebar */
  }
`;

export default function AppLayout() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <LayoutWrapper>
      {/* 1. Show overlay on mobile when sidebar is OPEN (not collapsed) */}
      {!collapsed && <MobileOverlay onClick={() => setCollapsed(true)} />}

      {/* 2. Sidebar */}
      <Sidebar />

      {/* 3. Main Content Area */}
      <Main $collapsed={collapsed}>
        <HeaderBar />
        <Content>
          <Outlet />
        </Content>
      </Main>
    </LayoutWrapper>
  );
}
