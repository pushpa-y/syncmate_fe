import { useEffect, useMemo, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../context/Authcontext";
import {
  selectActiveAccount,
  selectAccounts,
} from "../redux/selectors/appSelectors";
import { listEntries } from "../redux/actions/entryAction";
import { createEntry } from "../services/Entry";
import type { RootState } from "../redux/store";
import type { Account } from "../services/accounts";

// Styles
import {
  BaseCard,
  AddAccountButton as PrimaryButton,
} from "../styles/Dashboard";
import {
  EntryTableWrapper,
  EntryRow,
  HeaderSection,
  StatusIcon,
} from "../styles/Entries";
import { FiPlus, FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";

// Components & Constants
import Modal from "../components/modals/Modal";
import EntryFormCreate from "../components/forms/EntryFormCreate";
import { CATEGORY_MAP } from "../constants/categories";

const EntriesPage = () => {
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();

  const activeAccount = useSelector(selectActiveAccount);
  const accounts = useSelector(selectAccounts);
  const { entries, loading } = useSelector(
    (state: RootState) => state.entryList,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (auth?.token) {
      dispatch(
        listEntries(auth.token, {
          accountId: activeAccount === "all" ? undefined : activeAccount,
          page: 1,
          limit: 50,
        }) as any,
      );
    }
  }, [dispatch, auth?.token, activeAccount]);

  const displayEntries = useMemo(() => entries || [], [entries]);

  const handleCreateSubmit = async (formData: any) => {
    if (!auth?.token) return;
    try {
      await createEntry(auth.token, formData);
      setIsModalOpen(false);
      dispatch(
        listEntries(auth.token, {
          accountId: activeAccount === "all" ? undefined : activeAccount,
          page: 1,
          limit: 50,
        }) as any,
      );
    } catch (err) {
      console.error("Creation failed", err);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <HeaderSection>
        <div>
          <h2 style={{ margin: 0 }}>Transaction History</h2>
          <small style={{ color: "#666" }}>
            {activeAccount === "all" ? "All Accounts" : "Filtered View"}
          </small>
        </div>
        <PrimaryButton onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Add Transaction
        </PrimaryButton>
      </HeaderSection>

      <BaseCard $padding="0px">
        <EntryTableWrapper>
          <div className="header-row">
            <span>Category</span>
            <span>Notes</span>
            <span>Account</span>
            <span className="text-right">Amount</span>
          </div>

          {loading && (
            <p style={{ padding: "20px" }}>Loading transactions...</p>
          )}

          {!loading && displayEntries.length === 0 && (
            <p style={{ padding: "20px", textAlign: "center", color: "#666" }}>
              No transactions found.
            </p>
          )}

          {displayEntries.map((entry: any) => {
            const accountInfo = accounts.find(
              (acc: Account) =>
                acc._id === (entry.account || entry.baseAccount),
            );

            const categoryData = entry.category
              ? CATEGORY_MAP[entry.category as keyof typeof CATEGORY_MAP]
              : null;

            return (
              <EntryRow key={entry._id}>
                {/* Column 1: Category */}
                <div className="desc-cell">
                  <StatusIcon $isIncome={entry.entryType === "income"}>
                    {entry.entryType === "income" ? (
                      <FiArrowDownLeft />
                    ) : (
                      <FiArrowUpRight />
                    )}
                  </StatusIcon>
                  <span style={{ fontWeight: 500 }}>
                    {categoryData
                      ? `${categoryData.emoji} ${categoryData.label}`
                      : "Other"}
                  </span>
                </div>

                {/* Column 2:  (Notes) */}
                <span style={{ color: "#666", fontSize: "0.9rem" }}>
                  {entry.notes || "..."}
                </span>

                {/* Column 3: Account Name */}
                <span className="tag">
                  {accountInfo?.name || "Unknown Account"}
                </span>

                {/* Column 4: Amount */}
                <b className={entry.entryType === "income" ? "income" : ""}>
                  {entry.entryType === "income" ? "+" : "-"} ₹{entry.value}
                </b>
              </EntryRow>
            );
          })}
        </EntryTableWrapper>
      </BaseCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EntryFormCreate
          accounts={accounts}
          initialAccountId={activeAccount === "all" ? "" : activeAccount}
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default EntriesPage;
