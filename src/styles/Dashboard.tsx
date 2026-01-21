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

// Global Empty State for Transactions/Accounts
export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: ${(p) => p.theme.cardBg || "#ffffff"};
  border-radius: 20px;
  text-align: center;
  border: 1px dashed #e2e8f0;

  .icon {
    font-size: 54px;
    margin-bottom: 16px;
    filter: grayscale(1);
    opacity: 0.5;
  }

  h3 {
    margin-bottom: 8px;
    color: ${(p) => p.theme.text || "#1e293b"};
    font-weight: 700;
  }

  p {
    font-size: 14px;
    color: #64748b;
    max-width: 300px;
    margin-bottom: 24px;
    line-height: 1.5;
  }
`;

export const LoadMoreButton = styled.button`
  display: block;
  margin: 30px auto;
  padding: 10px 24px;
  background: white;
  color: #6366f1;
  border: 1px solid #6366f1;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f5f5ff;
    transform: translateY(-1px);
  }
`;
