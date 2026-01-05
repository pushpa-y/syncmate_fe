import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAccount } from "../../redux/actions/accountActions";
import styled from "styled-components";

const FormGroup = styled.div`
  margin-bottom: 16px;
  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    font-size: 14px;
    color: #4b5563;
  }
  input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    outline: none;
    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }
  }
`;

export default function AddAccountForm({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch();
  const [data, setData] = useState({ name: "", balance: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.name.trim() || loading) {
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        createAccount({
          name: data.name.trim(),
          balance: Number(data.balance) || 0,
        }) as any,
      );

      onClose();
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
        <label>Account Name</label>
        <input
          placeholder="e.g. HDFC Bank, Cash"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
          autoFocus
        />
      </FormGroup>

      <FormGroup>
        <label>Initial Balance</label>
        <input
          type="number"
          placeholder="0.00"
          value={data.balance}
          onChange={(e) => setData({ ...data, balance: e.target.value })}
        />
      </FormGroup>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            background: "#f3f4f6",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 2,
            padding: "12px",
            borderRadius: "8px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </div>
    </form>
  );
}
