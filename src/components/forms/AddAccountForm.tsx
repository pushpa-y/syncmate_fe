import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  createAccount,
  updateAccount,
} from "../../redux/actions/accountActions";
import styled from "styled-components";
import type { Account } from "../../services/accounts";
const FormGroup = styled.div`
  margin-bottom: 16px;
  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    font-size: 14px;
    color: ${(p) => p.theme.text};
  }
  input {
    width: 100%;
    padding: 10px;
    background: ${(p) => p.theme.bg};
    border-radius: 8px;
    border: 1px solid ${(p) => p.theme.glassBorder};
    color: ${(p) => p.theme.text};
    outline: none;
    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background: ${(p) => p.theme.glassBorder || "#334155"};
  color: ${(p) => p.theme.text};
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const SubmitButton = styled.button`
  flex: 2;
  padding: 12px;
  border-radius: 8px;
  background: #4f46e5;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface Props {
  onClose: () => void;
  initialData?: Account | null; // If this exists, we are in Edit mode
}

export default function AddAccountForm({ onClose, initialData }: Props) {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: initialData?.name || "",
    balance: initialData?.balance.toString() || "",
  });
  const [loading, setLoading] = useState(false);

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name.trim() || loading) return;

    setLoading(true);
    try {
      if (isEdit && initialData?._id) {
        await dispatch(
          updateAccount(initialData._id, {
            name: data.name.trim(),
            balance: Number(data.balance) || 0,
          }) as any,
        );
      } else {
        await dispatch(
          createAccount({
            name: data.name.trim(),
            balance: Number(data.balance) || 0,
          }) as any,
        );
      }
      onClose();
    } catch (err) {
      alert(`Failed to ${isEdit ? "update" : "create"} account.`);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
        <label>Account Name</label>
        <input
          placeholder="e.g. HDFC Bank"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
          autoFocus
        />
      </FormGroup>

      <FormGroup>
        <label>{isEdit ? "Current Balance" : "Initial Balance"}</label>
        <input
          type="number"
          placeholder="0.00"
          value={data.balance}
          onChange={(e) => setData({ ...data, balance: e.target.value })}
        />
      </FormGroup>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <CancelButton type="button" onClick={onClose}>
          Cancel
        </CancelButton>
        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Account" : "Create Account"}
        </SubmitButton>
      </div>
    </form>
  );
}
