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
import FiltersBar from "../components/FiltersBar";
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
  const [sortBy, setSortBy] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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
      const accId =
        activeAccount === "all" || !activeAccount ? undefined : activeAccount;

      dispatch(
        listEntries(auth.token, {
          page: p,
          limit: PER_PAGE,
          sortBy,
          category: categoryFilter,
          accountId: accId,
        }) as any,
      );
    },
    [auth?.token, activeAccount, sortBy, categoryFilter, dispatch],
  );

  useEffect(() => {
    syncData();
  }, [syncData]);
  useEffect(() => {
    fetchEntries(page);
  }, [fetchEntries, page]);
  useEffect(() => {
    setPage(1);
  }, [activeAccount, sortBy, categoryFilter]);

  const handleCreate = async (formData: any) => {
    if (!auth?.token) return;
    try {
      // If no accountId is in form (e.g. "Select Account" was empty), fallback to active sidebar account
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

  const hasMore = useMemo(() => page < reduxPages, [page, reduxPages]);

  return (
    <DashboardRoot>
      <DashboardGrid>
        <AccountsContainer />
        <ChartsSection entries={entries} />
        <FiltersBar
          sortBy={sortBy}
          setSortBy={setSortBy}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
        <EntryList
          entries={entries}
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
      </DashboardGrid>

      {/* CREATE MODAL */}
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
const LoadMoreButton = styled.button`
  padding: 12px 24px;
  background: ${(p) => p.theme.cardBg};
  border-radius: 12px;
  margin: 20px auto 80px;
  display: block;
  cursor: pointer;
  border: none;
`;

export default Dashboard;
