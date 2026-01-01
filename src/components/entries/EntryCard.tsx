import { useEffect } from "react";
import type { Entry as T } from "../../services/Entry";
import type { Account } from "../../services/accounts";
import {
  Card,
  Info,
  Row,
  LeftColumn,
  RightColumn,
  AmountDate,
  CategoryRow,
  MenuButtonWrapper,
} from "../../styles/EntryCard";
import { CATEGORY_MAP } from "../../constants/categories";

type Props = {
  entry: T;
  accounts: Account[];
  onEdit: (t: T) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export default function EntryCard({
  entry,
  accounts,
  onEdit,
  onDelete,
  isOpen,
  onToggleMenu,
  onCloseMenu,
}: Props) {
  const accountName = accounts.find((acc) => acc._id === entry.account)?.name;

  const category = entry.category
    ? CATEGORY_MAP[entry.category as keyof typeof CATEGORY_MAP]
    : undefined;
  const categoryLabel = category?.label ?? "Other";
  const categoryEmoji = category?.emoji ?? "📦";

  useEffect(() => {
    if (!isOpen) return;
    const close = () => onCloseMenu();
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [isOpen, onCloseMenu]);
  return (
    <Card
      className="glass"
      style={{ zIndex: isOpen ? 50 : 1 }}
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25 }}
    >
      <Info>
        <Row>
          <LeftColumn>
            <CategoryRow>
              <span>{categoryEmoji}</span>
              <span className="bold">{categoryLabel}</span>
            </CategoryRow>
            {accountName && <div className="muted">Account: {accountName}</div>}
            {entry.notes && <div className="muted">{entry.notes}</div>}
          </LeftColumn>

          <RightColumn>
            <AmountDate>
              <div
                className={`amount ${
                  entry.entryType === "income"
                    ? "income"
                    : entry.entryType === "expense"
                    ? "expense"
                    : "other"
                }`}
              >
                ₹{entry.value}
              </div>
              <div className="muted">{formatDate(entry.dueDate)}</div>
            </AmountDate>

            <MenuButtonWrapper>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMenu();
                }}
              >
                ⋮
              </button>

              {isOpen && (
                <div className="menu">
                  <div
                    onClick={() => {
                      onEdit(entry);
                      onCloseMenu();
                    }}
                  >
                    Edit
                  </div>
                  <div
                    className="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(entry._id);
                      onCloseMenu();
                    }}
                  >
                    Delete
                  </div>
                </div>
              )}
            </MenuButtonWrapper>
          </RightColumn>
        </Row>
      </Info>
    </Card>
  );
}
