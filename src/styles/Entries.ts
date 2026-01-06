import styled from "styled-components";

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    font-size: 22px;
    font-weight: 700;
    color: ${(p) => p.theme.text || "#1f2937"};
  }

  small {
    color: #6b7280;
  }
`;

export const EntryTableWrapper = styled.div`
  width: 100%;
  border-collapse: collapse;

  .header-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    padding: 14px 20px;
    background: rgba(0, 0, 0, 0.02);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .text-right {
    text-align: right;
  }
`;

export const EntryRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 16px 20px;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  transition: background 0.2s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.03);
  }

  .desc-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 500;
  }

  .tag {
    font-size: 11px;
    font-weight: 600;
    background: #f3f4f6;
    padding: 4px 10px;
    border-radius: 20px;
    width: fit-content;
    color: #4b5563;
  }

  b {
    text-align: right;
    font-size: 15px;
    color: #1f2937;

    &.income {
      color: #10b981;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr;
    gap: 8px;

    /* Hide Category and Account on small mobile to prevent squishing */
    & > span:nth-child(2),
    & > span:nth-child(3) {
      display: none;
    }
  }
`;

export const StatusIcon = styled.div<{ $isIncome: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(p) => (p.$isIncome ? "#ecfdf5" : "#fef2f2")};
  color: ${(p) => (p.$isIncome ? "#10b981" : "#ef4444")};

  svg {
    width: 16px;
    height: 16px;
  }
`;
