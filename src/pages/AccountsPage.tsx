import { useSelector, useDispatch } from "react-redux";
import {
  selectAccounts,
  selectActiveAccount,
} from "../redux/selectors/appSelectors";
import { setActiveAccount } from "../redux/actions/accountActions";
import type { Account } from "../services/accounts";

export default function AccountsPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const activeAccount = useSelector(selectActiveAccount);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", fontWeight: 700 }}>Accounts</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {accounts.map((acc: Account) => (
          <div
            key={acc._id}
            onClick={() => dispatch(setActiveAccount(acc._id) as any)}
            style={{
              padding: 12,
              borderRadius: 8,
              background: acc._id === activeAccount ? "#eef2ff" : "#fff",
              border:
                acc._id === activeAccount
                  ? "1px solid #4f46e5"
                  : "1px solid #e2e8f0",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.2s ease",
            }}
          >
            <span
              style={{
                fontWeight: acc._id === activeAccount ? 600 : 400,
                color: acc._id === activeAccount ? "#4f46e5" : "inherit",
              }}
            >
              {acc.name}
            </span>
            <strong style={{ color: "#10b981" }}>
              ₹{acc.balance.toLocaleString()}
            </strong>
          </div>
        ))}

        {accounts.length === 0 && (
          <p style={{ color: "#64748b", textAlign: "center" }}>
            No accounts found.
          </p>
        )}
      </div>
    </div>
  );
}
