import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { AuthContext } from "../context/Authcontext";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

// Redux
import {
  listAccounts,
  setActiveAccount,
} from "../redux/actions/accountActions";
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

  // Individual primitive selectors to avoid re-render warnings
  const reduxPages = useSelector((state: any) => state.entryList.pages || 1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [formData, setFormData] = useState({
    value: "",
    entryType: "expense" as "income" | "expense" | "transfer",
    dueDate: new Date().toISOString().split("T")[0],
    category: "",
    notes: "",
    fromAccount: "",
    toAccount: "",
  });

  const [editFormData, setEditFormData] = useState({
    value: "",
    entryType: "expense" as "income" | "expense" | "transfer",
    dueDate: "",
    category: "",
    notes: "",
    accountId: null as string | null,
    fromAccount: "",
    toAccount: "",
  });

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.token) return;
    try {
      const payload =
        formData.entryType === "transfer"
          ? { ...formData }
          : { ...formData, accountId: activeAccount };

      await createEntry(auth.token, payload);
      setFormData((prev) => ({ ...prev, value: "", notes: "" }));
      setPage(1);
      fetchEntries(1);
      syncData();
      setIsAddEntryModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setEditFormData({
      value: entry.value || "",
      entryType: (entry.entryType as any) || "expense",
      dueDate: entry.dueDate?.split("T")[0] || "",
      category: entry.category || "",
      notes: entry.notes || "",
      accountId: entry.baseAccount || null,
      fromAccount: entry.fromAccount || "",
      toAccount: entry.toAccount || "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.token || !editingEntry) return;

    try {
      let payload: any;

      if (editFormData.entryType === "transfer") {
        // For transfers, send specific transfer fields
        payload = {
          entryType: "transfer",
          value: editFormData.value,
          fromAccount: editFormData.fromAccount,
          toAccount: editFormData.toAccount,
          notes: editFormData.notes,
          dueDate: editFormData.dueDate,
        };
      } else {
        // For income/expense, send standard fields
        payload = {
          entryType: editFormData.entryType,
          value: editFormData.value,
          accountId: editFormData.accountId ?? undefined,
          category: editFormData.category,
          notes: editFormData.notes,
          dueDate: editFormData.dueDate,
        };
      }

      await updateEntry(auth.token, editingEntry._id, payload);

      fetchEntries(page);
      syncData();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
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

      <Modal
        isOpen={isAddEntryModalOpen}
        onClose={() => setIsAddEntryModalOpen(false)}
      >
        <EntryFormCreate
          {...formData}
          setValue={(v) => setFormData((p) => ({ ...p, value: v }))}
          setEntryType={(t) => setFormData((p) => ({ ...p, entryType: t }))}
          setNotes={(n) => setFormData((p) => ({ ...p, notes: n }))}
          setCategory={(c) => setFormData((p) => ({ ...p, category: c }))}
          setDueDate={(d) => setFormData((p) => ({ ...p, dueDate: d }))}
          setFromAccountId={(id) =>
            setFormData((p) => ({ ...p, fromAccount: id }))
          }
          setToAccountId={(id) => setFormData((p) => ({ ...p, toAccount: id }))}
          accountId={
            activeAccount === "all" ? undefined : (activeAccount ?? undefined)
          }
          setAccountId={(id) => id && dispatch(setActiveAccount(id) as any)}
          accounts={accounts}
          onSubmit={handleCreate}
          onCancel={() => setIsAddEntryModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EntryFormEdit
          {...editFormData}
          editValue={editFormData.value}
          setEditValue={(v) => setEditFormData((p) => ({ ...p, value: v }))}
          editEntryType={editFormData.entryType}
          setEditEntryType={(t) =>
            setEditFormData((p) => ({ ...p, entryType: t }))
          }
          editDueDate={editFormData.dueDate}
          setEditDueDate={(d) => setEditFormData((p) => ({ ...p, dueDate: d }))}
          editNotes={editFormData.notes}
          setEditNotes={(n) => setEditFormData((p) => ({ ...p, notes: n }))}
          editAccountId={editFormData.accountId || undefined}
          setEditAccountId={(id) =>
            setEditFormData((p) => ({ ...p, accountId: id || null }))
          }
          editFromAccountId={editFormData.fromAccount}
          setEditFromAccountId={(id) =>
            setEditFormData((p) => ({ ...p, fromAccount: id }))
          }
          editToAccountId={editFormData.toAccount}
          setEditToAccountId={(id) =>
            setEditFormData((p) => ({ ...p, toAccount: id }))
          }
          editCategory={editFormData.category}
          setEditCategory={(c) =>
            setEditFormData((p) => ({ ...p, category: c }))
          }
          accounts={accounts}
          onSubmit={handleEdit}
          onCancel={() => setIsModalOpen(false)}
        />
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
`;

export default Dashboard;
