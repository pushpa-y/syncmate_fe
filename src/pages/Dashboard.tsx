import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { AuthContext } from "../context/Authcontext";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { listAccounts } from "../redux/actions/accountActions";
import { listEntries } from "../redux/actions/entryAction";
import {
  selectEntries,
  selectEntriesLoading,
  selectAccounts,
  selectActiveAccount,
} from "../redux/selectors/appSelectors";

// Services & Types
import { createEntry, updateEntry, deleteEntry } from "../services/Entry";
import type { Entry } from "../services/Entry";

// Components
import Modal from "../components/modals/Modal";
import EntryList from "../components/entries/EntryList";
import EntryFormCreate from "../components/forms/EntryFormCreate";
import EntryFormEdit from "../components/forms/EntryFormEdit";
import AccountsContainer from "../components/accounts/AccountsContainer";
import ChartsSection from "../components/charts/ChartsSection";
import ScrollToTop from "../components/entries/ScrollToTop";
import { FloatingAddButton } from "../styles/Dashboard";

const PER_PAGE = 10;

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();

  const entries = useSelector(selectEntries);
  const accounts = useSelector(selectAccounts);
  const activeAccount = useSelector(selectActiveAccount);
  const isLoading = useSelector(selectEntriesLoading);
  const reduxPages = useSelector((state: any) => state.entryList.pages || 1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [page, setPage] = useState(1);

  // REMOVED: sortBy and categoryFilter states

  const startEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const syncData = useCallback(() => {
    if (auth?.token) dispatch(listAccounts(auth.token) as any);
  }, [auth?.token, dispatch]);

  const fetchEntries = useCallback(
    (p = 1) => {
      if (!auth?.token) return;

      const accId = activeAccount === "all" ? undefined : activeAccount;

      dispatch(
        listEntries(auth.token, {
          page: p,
          limit: PER_PAGE,
          accountId: accId,
        }) as any,
      );
    },
    [auth?.token, activeAccount, dispatch],
  );

  useEffect(() => {
    syncData();
  }, [syncData]);

  useEffect(() => {
    fetchEntries(page);
  }, [fetchEntries, page]);

  // Reset page to 1 whenever the active account changes
  useEffect(() => {
    setPage(1);
  }, [activeAccount]);

  const handleCreate = async (formData: any) => {
    if (!auth?.token) return;
    try {
      const payload = {
        ...formData,
        accountId:
          formData.accountId ||
          (activeAccount === "all" ? undefined : activeAccount),
      };

      await createEntry(auth.token, payload);
      setPage(1);
      fetchEntries(1);
      syncData();
      setIsAddEntryModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (id: string, updatedData: any) => {
    if (!auth?.token) return;
    try {
      const payload = {
        ...updatedData,
        value: Number(updatedData.value),
        accountId: updatedData.accountId || undefined,
        fromAccount: updatedData.fromAccount || undefined,
        toAccount: updatedData.toAccount || undefined,
      };

      await updateEntry(auth.token, id, payload);
      fetchEntries(page);
      syncData();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const filteredEntriesForList = useMemo(() => {
    if (activeAccount === "all" || !activeAccount) {
      return entries;
    }
    return entries.filter(
      (e: Entry) =>
        e.account === activeAccount || e.baseAccount === activeAccount,
    );
  }, [entries, activeAccount]);

  const hasMore = useMemo(() => page < reduxPages, [page, reduxPages]);

  return (
    <DashboardRoot>
      <DashboardGrid>
        <AccountsContainer />

        <ContentSection>
          <SectionHeader>
            <SectionTitle>Analytics & Insights</SectionTitle>
          </SectionHeader>
          <ChartsSection entries={entries} />
        </ContentSection>

        <ContentSection>
          <SectionHeader>
            <SectionTitle>Transaction History</SectionTitle>
            <div style={{ fontSize: "12px", opacity: 0.6 }}>
              Showing latest activity
            </div>
          </SectionHeader>

          <EntryList
            entries={filteredEntriesForList}
            accounts={accounts}
            onEdit={startEdit}
            onDelete={async (id) => {
              if (auth?.token) {
                await deleteEntry(auth.token, id);
                fetchEntries(page);
                syncData();
              }
            }}
          />

          {hasMore && (
            <LoadMoreButton
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More Transactions"}
            </LoadMoreButton>
          )}
        </ContentSection>
      </DashboardGrid>

      <Modal
        isOpen={isAddEntryModalOpen}
        onClose={() => setIsAddEntryModalOpen(false)}
      >
        <EntryFormCreate
          accounts={accounts}
          initialAccountId={activeAccount === "all" ? "" : activeAccount}
          onSubmit={handleCreate}
          onCancel={() => setIsAddEntryModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {editingEntry && (
          <EntryFormEdit
            entry={editingEntry}
            accounts={accounts}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>

      <ScrollToTop />
      <FloatingAddButton onClick={() => setIsAddEntryModalOpen(true)}>
        +
      </FloatingAddButton>
    </DashboardRoot>
  );
};

// --- STYLES ---

const DashboardRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${(p) => p.theme.bg};
`;

const DashboardGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ContentSection = styled.section`
  background: ${(p) => p.theme.cardBg};
  border: 1px solid ${(p) => p.theme.glassBorder || "rgba(0,0,0,0.05)"};
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${(p) => p.theme.glassBorder || "rgba(0,0,0,0.05)"};
  margin-bottom: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(p) => p.theme.text};
  opacity: 0.9;
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 30px auto 80px;
  padding: 12px 32px;
  background: ${(p) => p.theme.accent};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  &:disabled {
    background: ${(p) => p.theme.muted};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default Dashboard;
