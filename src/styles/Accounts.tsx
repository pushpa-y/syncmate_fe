import styled from "styled-components";

export const AccountsSectionCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 16px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  margin-bottom: 16px;
  border: 1px solid #f1f5f9;
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
    color: #0f172a;
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
  background: #f8fafc;
  border: 1px solid #f1f5f9;

  &:hover {
    background: #f1f5f9;
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
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
  color: #64748b;

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
  background: ${(p) => (p.$active ? "#6366f1" : "#f8fafc")};
  color: ${(p) => (p.$active ? "white" : "#1e293b")};
  border: 1px solid ${(p) => (p.$active ? "#4f46e5" : "#f1f5f9")};

  &:hover {
    transform: translateY(-1px);
    background: ${(p) => (p.$active ? "#4f46e5" : "#f1f5f9")};
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
  border-top: 1px solid #f1f5f9;
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
