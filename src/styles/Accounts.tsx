import styled from "styled-components";

export const AccountsSectionCard = styled.div`
  background: ${(p) => p.theme.cardBg || "white"};
  border-radius: 20px;
  padding: 16px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  margin-bottom: 16px;
  border: 1px solid ${(p) => p.theme.glassBorder || "#f1f5f9"};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .title-group h3 {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: ${(p) => p.theme.text};
  }

  .total-label {
    font-size: 12px;
    color: #6366f1;
    font-weight: 700;
    display: block;
    margin-top: -2px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SettingsIcon = styled.div`
  font-size: 18px;
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.bg || "#f8fafc"};
  border: 1px solid ${(p) => p.theme.glassBorder || "#f1f5f9"};
  color: ${(p) => p.theme.text};

  &:hover {
    background: ${(p) => p.theme.glassBorder};
    color: #6366f1;
  }
`;

export const CarouselContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const CarouselButton = styled.button`
  position: absolute;
  z-index: 10;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(p) => p.theme.cardBg};
  border: 1px solid ${(p) => p.theme.glassBorder};
  color: ${(p) => p.theme.textMuted};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;

  &:hover {
    background: #6366f1;
    color: white;
  }

  &.left {
    left: -12px;
  }
  &.right {
    right: -12px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const AccountsHorizontalScroll = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 0;
  scroll-behavior: smooth;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

export const AccountPill = styled.div<{ $active: boolean }>`
  flex: 0 0 190px;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(p) => (p.$active ? "#6366f1" : p.theme.bg)};
  color: ${(p) => (p.$active ? "white" : p.theme.text)};
  border: 1px solid ${(p) => (p.$active ? "#4f46e5" : p.theme.glassBorder)};

  &:hover {
    transform: translateY(-1px);
    background: ${(p) => (p.$active ? "#4f46e5" : p.theme.cardBg)};
  }
`;

export const PillInfo = styled.div`
  p {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  small {
    font-size: 12px;
    opacity: 0.8;
    font-weight: 600;
  }
`;

export const AddAccountSmall = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #4f46e5;
  }
`;

export const SelectAllWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${(p) => p.theme.glassBorder || "#f1f5f9"};
`;

export const AllAccountsLink = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #6366f1;
  text-decoration: underline;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

//account page styles

export const PageContainer = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  margin-bottom: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.text};
`;

export const AccountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AccountCard = styled.div<{ $isActive: boolean }>`
  padding: 16px 20px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease-in-out;

  background: ${(props) =>
    props.$isActive ? props.theme.sidebarBg : props.theme.cardBg};

  border: 1px solid
    ${(props) =>
      props.$isActive ? props.theme.accent : props.theme.glassBorder};

  box-shadow: ${(props) =>
    props.$isActive ? "0 4px 12px rgba(79, 70, 229, 0.2)" : "none"};

  &:hover {
    transform: translateY(-2px);
    border-color: ${(props) => props.theme.accent};
    background: ${(props) => props.theme.sidebarBg};
    .action-buttons {
      opacity: 1;
    }
  }
`;

export const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AccountName = styled.span<{ $isActive: boolean }>`
  font-size: 16px;
  font-weight: ${(props) => (props.$isActive ? "600" : "500")};
  color: ${(props) =>
    props.$isActive ? props.theme.accent : props.theme.text};
`;
export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
export const Balance = styled.strong`
  color: #10b981;
  font-size: 18px;
  font-family: "Inter", sans-serif;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

export const EmptyText = styled.p`
  color: ${(props) => props.theme.muted};
  text-align: center;
  margin-top: 40px;
  font-size: 15px;
`;
export const IconButton = styled.button<{ $variant?: "danger" | "default" }>`
  background: ${(props) => props.theme.bg};
  border: 1px solid ${(props) => props.theme.glassBorder};
  color: ${(props) =>
    props.$variant === "danger" ? "#ef4444" : props.theme.text};
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.$variant === "danger" ? "#fee2e2" : props.theme.accent};
    color: ${(props) => (props.$variant === "danger" ? "#b91c1c" : "#fff")};
    border-color: transparent;
  }
`;
