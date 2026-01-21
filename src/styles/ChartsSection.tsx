import styled from "styled-components";
import { motion } from "framer-motion";

export const ChartsContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 20px;
  width: 100%;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ChartCard = styled(motion.div)`
  background: ${({ theme }) => theme.cardBg || "white"};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  min-height: 360px;
  width: 100%;
  box-sizing: border-box;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  &.full-width {
    grid-column: 1 / -1;
  }
`;

export const MonthSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  width: 100%;
`;

export const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  margin-bottom: 30px;
  flex-wrap: wrap;

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
  }

  .filter-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    color: ${({ theme }) => theme.muted};
    letter-spacing: 0.05em;
    margin-left: 4px;
  }

  .filter-divider {
    width: 1px;
    height: 35px;
    background: rgba(0, 0, 0, 0.08);
    @media (max-width: 768px) {
      display: none;
    }
  }

  .segmented-control {
    display: flex;
    background: rgba(0, 0, 0, 0.04);
    padding: 3px;
    border-radius: 10px;
    gap: 2px;

    button {
      border: none;
      background: transparent;
      padding: 6px 14px;
      border-radius: 7px;
      font-size: 0.8rem;
      font-weight: 600;
      color: ${({ theme }) => theme.text};
      cursor: pointer;
      transition: all 0.2s ease;

      &.active {
        background: white;
        color: #6366f1;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      }

      &:hover:not(.active) {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .more-btn {
      padding: 0 10px;
      font-size: 1.1rem;
    }
  }
`;

export const MonthButton = styled.button<{ $active: boolean }>`
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s ease;

  background: ${({ $active, theme }) =>
    $active ? theme.accent : theme.surface};
  color: ${({ $active, theme }) => ($active ? "#fff" : theme.text)};

  &:hover {
    filter: brightness(1.2);
  }
`;
export const ChartTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  margin-bottom: 4px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${(props) => props.theme.text};
  font-size: 16px;
`;
export const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const SummaryCard = styled(ChartCard)<{ $color: string }>`
  min-height: auto;
  align-items: flex-start;
  padding: 16px;
  border-left: 4px solid ${({ $color }) => $color};
  gap: 4px;

  p {
    font-size: 12px;
    color: ${(props) => props.theme.muted};
    margin: 0;
    font-weight: 500;
  }

  h3 {
    font-size: 1.25rem;
    color: ${({ $color }) => $color};
    margin: 0;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${(props) => props.theme.sidebarBg};
  z-index: 100;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  min-width: 140px;
`;

export const DropdownItem = styled.div`
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

export const RelativeWrapper = styled.div`
  position: relative;
`;
