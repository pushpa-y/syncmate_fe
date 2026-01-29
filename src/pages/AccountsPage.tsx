import { useSelector, useDispatch } from "react-redux";
import {
  selectAccounts,
  selectActiveAccount,
} from "../redux/selectors/appSelectors";
import { setActiveAccount } from "../redux/actions/accountActions";
import type { Account } from "../services/accounts";
import {
  PageContainer,
  Title,
  AccountList,
  AccountCard,
  AccountInfo,
  AccountName,
  Balance,
  EmptyText,
} from "../styles/Accounts";

export default function AccountsPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const activeAccountId = useSelector(selectActiveAccount);

  return (
    <PageContainer>
      <Title>Accounts Management</Title>

      <AccountList>
        {accounts.map((acc: Account) => {
          const isActive = acc._id === activeAccountId;

          return (
            <AccountCard
              key={acc._id}
              $isActive={isActive}
              onClick={() => dispatch(setActiveAccount(acc._id) as any)}
            >
              <AccountInfo>
                <AccountName $isActive={isActive}>{acc.name}</AccountName>
              </AccountInfo>

              <Balance>₹{acc.balance.toLocaleString("en-IN")}</Balance>
            </AccountCard>
          );
        })}

        {accounts.length === 0 && (
          <EmptyText>No accounts found. Add one to get started.</EmptyText>
        )}
      </AccountList>
    </PageContainer>
  );
}
