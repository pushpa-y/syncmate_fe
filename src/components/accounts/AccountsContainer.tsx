import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAccounts,
  selectActiveAccount,
} from "../../redux/selectors/appSelectors";
import {
  deleteAccount,
  updateAccount,
  setActiveAccount,
} from "../../redux/actions/accountActions";
import type { Account } from "../../services/accounts";

import {
  AccountsCard,
  AccountsWrapper,
  AccountItem,
  DotsWrapper,
  AccountMenu,
  MenuItem,
  MenuItemDanger,
  AddAccountButton,
  AllAccountsLink,
  SelectAllWrapper,
} from "../../styles/Dashboard";

import { AddAccountModal } from "../modals/AddAccountModal";
import { EditAccountModal } from "../modals/EditAccountModal";
import ConfirmationModal from "../modals/ConfirmationModal";

const AccountsContainer = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const activeAccount = useSelector(selectActiveAccount);

  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editAccountData, setEditAccountData] = useState<Account | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setActiveAccount("all") as any);
  };

  useEffect(() => {
    const close = () => setMenuOpenFor(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <>
      <AccountsCard>
        <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
          Your Accounts
        </h3>

        <AccountsWrapper>
          {accounts.map((acc: Account) => (
            <AccountItem
              key={acc._id}
              $active={activeAccount === "all" || activeAccount === acc._id}
              onClick={() => dispatch(setActiveAccount(acc._id) as any)}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{acc.name}</p>
                <small style={{ opacity: 0.7 }}>
                  ₹{acc.balance.toLocaleString()}
                </small>
              </div>

              <DotsWrapper
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenFor(acc._id === menuOpenFor ? null : acc._id);
                }}
              >
                ⋮
              </DotsWrapper>

              {menuOpenFor === acc._id && (
                <AccountMenu onClick={(e) => e.stopPropagation()}>
                  <MenuItem
                    onClick={() => {
                      setEditAccountData(acc);
                      setMenuOpenFor(null);
                    }}
                  >
                    Edit Account
                  </MenuItem>
                  <MenuItemDanger
                    onClick={() => {
                      setConfirmDeleteId(acc._id);
                      setMenuOpenFor(null);
                    }}
                  >
                    Delete
                  </MenuItemDanger>
                </AccountMenu>
              )}
            </AccountItem>
          ))}

          <AddAccountButton onClick={() => setIsAddModalOpen(true)}>
            + Add Account
          </AddAccountButton>
        </AccountsWrapper>

        <SelectAllWrapper>
          <AllAccountsLink onClick={handleSelectAll}>
            Select All Accounts
          </AllAccountsLink>
        </SelectAllWrapper>
      </AccountsCard>

      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {editAccountData && (
        <EditAccountModal
          isOpen={!!editAccountData}
          onClose={() => setEditAccountData(null)}
          account={editAccountData}
          onSave={async (data) => {
            await dispatch(updateAccount(editAccountData._id, data) as any);
            setEditAccountData(null);
          }}
        />
      )}

      <ConfirmationModal
        open={!!confirmDeleteId}
        title="Delete Account?"
        message="Are you sure? All entries for this account will remain but lose their association."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={async () => {
          if (confirmDeleteId)
            await dispatch(deleteAccount(confirmDeleteId) as any);
          setConfirmDeleteId(null);
        }}
      />
    </>
  );
};

export default AccountsContainer;
