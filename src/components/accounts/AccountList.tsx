import { selectAccounts } from "../../redux/selectors/appSelectors";
import type { Account } from "../../services/accounts";
import { useSelector } from "react-redux";

type Props = {
  activeId?: string;
  onSelect: (id?: string) => void;
};

export default function AccountsList({ activeId, onSelect }: Props) {
  const accounts = useSelector(selectAccounts);

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <h4 className="font-semibold">Accounts</h4>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onSelect(undefined)}
          className={`text-left p-2 rounded ${
            !activeId ? "bg-indigo-600 text-white" : "bg-slate-100"
          }`}
        >
          All accounts
        </button>
        {accounts.map((acc: Account) => (
          <button
            key={acc._id}
            onClick={() => onSelect(acc._id)}
            className={`text-left p-2 rounded ${
              activeId === acc._id ? "bg-indigo-600 text-white" : "bg-slate-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>{acc.name}</div>
              <div className="text-sm font-medium">₹{acc.balance}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
