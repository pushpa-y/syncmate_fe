import styled from "styled-components";
import { motion } from "framer-motion";

export const BaseCard = styled(motion.div)<{
  $clickable?: boolean;
  $padding?: string;
  $radius?: string;
  $bg?: string;
}>`
  background: ${({ $bg, theme }) => $bg || theme.cardBg || "white"};
  padding: ${({ $padding }) => $padding || "16px"};
  border-radius: ${({ $radius }) => $radius || "12px"};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: block;
  margin-bottom: 20px;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  transition: 0.2s ease;

  &:hover {
    transform: ${({ $clickable }) =>
      $clickable ? "translateY(-1px)" : "none"};
  }
`;
export const SelectAllWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.glassBorder || "#f3f4f6"};
  padding-top: 12px;
`;

export const AccountsCard = styled(BaseCard)`
  padding: 18px 20px;
  border-radius: 14px;
`;

export const AccountItem = styled.div<{ $active: boolean }>`
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  position: relative;
  border-radius: 12px;
  background: ${(p) =>
    p.$active ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.5)"};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: 0.2s ease;
  z-index: ${(p) => (p.$active ? 2 : 1)};

  &:hover {
    background: ${(p) =>
      p.$active ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.8)"};
  }
`;

export const AddAccountButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #6366f1;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);

  &:hover {
    background: #4f46e5;
    transform: translateY(-1px);
    box-shadow: 0 6px 15px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 1.1rem;
  }
`;
export const AllAccountsLink = styled.button`
  background: none;
  border: none;
  display: inline-block;
  text-align: center;
  margin-top: 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #6366f1;
  text-decoration: underline;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
    color: #4f46e5;
  }

  @media (max-width: 600px) {
    font-size: 13px;
    margin-top: 12px;
  }
`;

export const AccountsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
`;

export const FloatingAddButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #6366f1;
  color: white;
  border: none;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    background-color: #4f46e5;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }
`;

export const DotsWrapper = styled.div`
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
  user-select: none;
  margin-left: 8px;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

export const AccountMenu = styled.div`
  position: absolute;
  top: 46px;
  right: 14px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  width: 150px;
  z-index: 999;
`;

export const MenuItem = styled.div`
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #f3f4f6;
  }
`;

export const MenuItemDanger = styled(MenuItem)`
  color: #ef4444;
  &:hover {
    background: #fee2e2;
  }
`;
