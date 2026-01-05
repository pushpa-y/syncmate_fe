import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectEntries, selectAccounts } from "../redux/selectors/appSelectors";
import { exportToCSV } from "../utils/exportUtils";

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-bottom: 20px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledSelect = styled.select`
  background: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.glassBorder};
  padding: 8px 12px;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  min-width: 140px;

  &:hover {
    border-color: ${(props) => props.theme.accent};
    background: ${(props) => props.theme.sidebarBg};
  }

  option {
    background: ${(props) => props.theme.sidebarBg};
    color: ${(props) => props.theme.text};
  }
`;

const ExportButton = styled.button`
  background: transparent;
  color: ${(props) => props.theme.accent};
  border: 1px solid ${(props) => props.theme.accent};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.accent};
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${(props) => props.theme.accent}44;
  }

  &:active {
    transform: translateY(0);
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.muted};
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  padding: 0 5px;

  &:hover {
    color: #ef4444;
  }
`;

type Props = {
  sortBy: string;
  setSortBy: (s: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  categories?: string[];
};

export default function FiltersBar({
  sortBy,
  setSortBy,
  categoryFilter,
  setCategoryFilter,
  categories,
}: Props) {
  const entries = useSelector(selectEntries);
  const accounts = useSelector(selectAccounts);
  const hasFilters = sortBy !== "" || categoryFilter !== "";

  const handleClear = () => {
    setSortBy("");
    setCategoryFilter("");
  };

  return (
    <FiltersContainer>
      <ControlGroup>
        <StyledSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="due-asc">Date (Oldest First)</option>
          <option value="due-desc">Date (Newest First)</option>
          <option value="value-desc">Amount (High to Low)</option>
          <option value="value-asc">Amount (Low to High)</option>
        </StyledSelect>

        <StyledSelect
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {(
            categories || [
              "food",
              "transport",
              "shopping",
              "rent",
              "health",
              "salary",
              "other",
            ]
          ).map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </StyledSelect>

        {hasFilters && <ClearButton onClick={handleClear}>Reset</ClearButton>}
      </ControlGroup>

      <ExportButton onClick={() => exportToCSV(entries, accounts)}>
        <span>📥</span>
        Export to CSV
      </ExportButton>
    </FiltersContainer>
  );
}
