import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import {
  selectAccounts,
  selectActiveAccount,
} from "../redux/selectors/appSelectors";
import {
  setActiveAccount,
  deleteAccount,
} from "../redux/actions/accountActions";
import type { Account } from "../services/accounts";
import { AddAccountModal } from "../components/modals/AddAccountModal";

import {
  PageContainer,
  Title,
  AccountList,
  AccountCard,
  AccountInfo,
  AccountName,
  Balance,
  EmptyText,
  RightSection,
  ActionGroup,
  IconButton,
  HeaderActions,
  AddAccountSmall,
} from "../styles/Accounts";

export default function AccountsPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const activeAccountId = useSelector(selectActiveAccount);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, acc: Account) => {
    e.stopPropagation();
    setEditingAccount(acc);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this account? This action cannot be undone.",
      )
    ) {
      try {
        setIsDeleting(id);
        await dispatch(deleteAccount(id) as any);
      } catch (err) {
        console.error("Delete failed", err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <PageContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <Title style={{ margin: 0 }}>Accounts Management</Title>
        <HeaderActions>
          <AddAccountSmall onClick={handleAddClick}>
            + Add Account
          </AddAccountSmall>
        </HeaderActions>
      </div>

      <AccountList>
        {accounts.map((acc: Account) => {
          const isActive = acc._id === activeAccountId;
          const loading = isDeleting === acc._id;

          return (
            <AccountCard
              key={acc._id}
              $isActive={isActive}
              onClick={() =>
                !loading && dispatch(setActiveAccount(acc._id) as any)
              }
            >
              <AccountInfo>
                <AccountName $isActive={isActive}>{acc.name}</AccountName>
              </AccountInfo>

              <RightSection>
                <Balance>₹{acc.balance.toLocaleString("en-IN")}</Balance>

                <ActionGroup className="action-buttons">
                  <IconButton
                    onClick={(e) => handleEditClick(e, acc)}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </IconButton>

                  <IconButton
                    $variant="danger"
                    onClick={(e) => handleDelete(e, acc._id)}
                    title="Delete"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </IconButton>
                </ActionGroup>
              </RightSection>
            </AccountCard>
          );
        })}

        {accounts.length === 0 && (
          <EmptyText>No accounts found. Add one to get started.</EmptyText>
        )}
      </AccountList>

      <AddAccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingAccount}
      />
    </PageContainer>
  );
}
