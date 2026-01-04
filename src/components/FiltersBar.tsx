import styled from "styled-components";

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

  &:hover {
    border-color: ${(props) => props.theme.accent};
  }

  option {
    background: ${(props) => props.theme.sidebarBg};
    color: ${(props) => props.theme.text};
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
  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
      <div className="flex gap-3 w-full sm:w-auto">
        <StyledSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="due-asc">Due (old→new)</option>
          <option value="due-desc">Due (new→old)</option>
        </StyledSelect>

        <StyledSelect
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {(
            categories || ["work", "personal", "shopping", "finance", "health"]
          ).map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </StyledSelect>
      </div>
    </div>
  );
}
