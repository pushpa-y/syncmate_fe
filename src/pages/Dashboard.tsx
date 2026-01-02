import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/Authcontext";
import { useAccounts } from "../context/AccountsContext";
import { useDispatch } from "react-redux";
import { listAccounts } from "../redux/actions/accountActions";
import styled from "styled-components";

import {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../services/Entry";
import type { Entry } from "../services/Entry";

// components
import Modal from "../components/modals/Modal";
import FiltersBar from "../components/FiltersBar";
import EntryList from "../components/entries/EntryList";
import EntryFormCreate from "../components/forms/EntryFormCreate";
import EntryFormEdit from "../components/forms/EntryFormEdit";
import AccountsContainer from "../components/accounts/AccountsContainer";
import ChartsSection from "../components/charts/ChartsSection";

import { FloatingAddButton } from "../styles/Dashboard";

const DashboardRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  overflow-x: hidden;
`;

const DashboardGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 12px;
    max-width: 100vw;
    overflow-x: hidden;
    //gap: 16px;
  }
`;

const PER_PAGE = 10;

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();
  const {
    accounts,
    activeAccount,
    setActiveAccount,
    applyBalanceChange,
    applyBalanceDelete,
    moveBalanceBetweenAccounts,
  } = useAccounts();

  // --- State ---
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Create Form State
  const [value, setValue] = useState("");
  const [entryType, setEntryType] = useState<"income" | "expense" | "transfer">(
    "expense"
  );
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");

  // Edit Form State
  const [editValue, setEditValue] = useState("");
  const [editEntryType, setEditEntryType] = useState<
    "income" | "expense" | "transfer"
  >("expense");
  const [editDueDate, setEditDueDate] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editAccountId, setEditAccountId] = useState<string | null>(null);
  const [editFromAccountId, setEditFromAccountId] = useState("");
  const [editToAccountId, setEditToAccountId] = useState("");

  const syncBalances = useCallback(() => {
    if (auth?.token) dispatch(listAccounts(auth.token) as any);
  }, [auth?.token, dispatch]);

  const fetchEntries = async (p = 1) => {
    if (!auth?.token) return;
    try {
      const accId =
        activeAccount === "all" || !activeAccount ? undefined : activeAccount;
      const res = await getEntries(auth.token, {
        page: p,
        limit: PER_PAGE,
        sortBy,
        category: categoryFilter,
        accountId: accId,
      });
      setEntries(res.data.entries);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    syncBalances();
  }, [syncBalances]);
  useEffect(() => {
    fetchEntries(page);
  }, [auth?.token, sortBy, page, categoryFilter, activeAccount]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.token) return;

    try {
      //Explicitly defining payload keys //fix later
      const payload: any =
        entryType === "transfer"
          ? { entryType, value, fromAccount, toAccount, notes, dueDate }
          : {
              entryType,
              value,
              accountId: activeAccount!,
              category,
              notes,
              dueDate,
            };

      await createEntry(auth.token, payload);

      if (entryType === "transfer")
        moveBalanceBetweenAccounts(fromAccount, toAccount, Number(value));
      else
        applyBalanceChange(
          activeAccount!,
          entryType === "income" ? Number(value) : -Number(value)
        );

      setValue("");
      setNotes("");
      fetchEntries(1);
      syncBalances();
      setIsAddEntryModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!auth?.token) return;
    const entry = entries.find((e) => e._id === id);
    if (!entry) return;
    await deleteEntry(auth.token, id);
    if (entry.entryType === "transfer")
      moveBalanceBetweenAccounts(
        entry.toAccount!,
        entry.fromAccount!,
        Number(entry.value)
      );
    else
      applyBalanceDelete(
        entry.baseAccount!,
        entry.entryType === "income"
          ? Number(entry.value)
          : -Number(entry.value)
      );
    setEntries((prev) => prev.filter((e) => e._id !== id));
    syncBalances();
  };

  const startEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setEditValue(entry.value || "");
    setEditEntryType(entry.entryType ?? "expense");
    setEditDueDate(entry.dueDate?.split("T")[0] || "");
    setEditCategory(entry.category || "");
    setEditNotes(entry.notes || "");
    setEditAccountId(entry.baseAccount ?? null);
    setEditFromAccountId(entry.fromAccount || "");
    setEditToAccountId(entry.toAccount || "");
    setIsModalOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.token || !editingEntry) return;

    const payload: any =
      editEntryType === "transfer"
        ? {
            entryType: "transfer",
            value: editValue,
            fromAccount: editFromAccountId,
            toAccount: editToAccountId,
            notes: editNotes,
            dueDate: editDueDate,
          }
        : {
            entryType: editEntryType,
            value: editValue,
            accountId: editAccountId ?? undefined,
            notes: editNotes,
            category: editCategory,
            dueDate: editDueDate,
          };

    await updateEntry(auth.token, editingEntry._id, payload);
    fetchEntries(page);
    syncBalances();
    setIsModalOpen(false);
  };

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
          onDelete={handleDelete}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "20px 0 80px",
          }}
        >
          <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
            Prev
          </button>
          <button onClick={() => setPage(page + 1)} disabled={page >= pages}>
            Next
          </button>
        </div>
      </DashboardGrid>

      <Modal
        isOpen={isAddEntryModalOpen}
        onClose={() => setIsAddEntryModalOpen(false)}
      >
        <EntryFormCreate
          value={value}
          setValue={setValue}
          entryType={entryType}
          setEntryType={setEntryType}
          accountId={
            activeAccount === "all" ? undefined : activeAccount ?? undefined
          }
          setAccountId={setActiveAccount}
          fromAccountId={fromAccount}
          setFromAccountId={setFromAccount}
          toAccountId={toAccount}
          setToAccountId={setToAccount}
          dueDate={dueDate}
          setDueDate={setDueDate}
          notes={notes}
          setNotes={setNotes}
          category={category}
          setCategory={setCategory}
          accounts={accounts}
          onSubmit={handleCreate}
          onCancel={() => setIsAddEntryModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EntryFormEdit
          editValue={editValue}
          setEditValue={setEditValue}
          editEntryType={editEntryType}
          setEditEntryType={setEditEntryType}
          editDueDate={editDueDate}
          setEditDueDate={setEditDueDate}
          editNotes={editNotes}
          setEditNotes={setEditNotes}
          editAccountId={editAccountId ?? undefined}
          setEditAccountId={setEditAccountId}
          editFromAccountId={editFromAccountId}
          setEditFromAccountId={setEditFromAccountId}
          editToAccountId={editToAccountId}
          setEditToAccountId={setEditToAccountId}
          editCategory={editCategory}
          setEditCategory={setEditCategory}
          accounts={accounts}
          onSubmit={handleEdit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <FloatingAddButton onClick={() => setIsAddEntryModalOpen(true)}>
        +
      </FloatingAddButton>
    </DashboardRoot>
  );
};

export default Dashboard;
