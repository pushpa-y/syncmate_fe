import React, { useState, useEffect } from "react";
import type { Account } from "../../services/accounts";
import { Form } from "../../styles/EntryFormEdit";
import { CATEGORIES } from "../../constants/categories";

type Props = {
  accounts: Account[];
  initialAccountId?: string;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
};

export default function EntryFormCreate({
  accounts,
  initialAccountId,
  onSubmit,
  onCancel,
}: Props) {
  const [formData, setFormData] = useState({
    value: "",
    entryType: "expense" as "income" | "expense" | "transfer",
    accountId: initialAccountId || "",
    fromAccount: "",
    toAccount: "",
    dueDate: new Date().toISOString().split("T")[0],
    notes: "",
    category: "",
  });

  useEffect(() => {
    if (initialAccountId) {
      setFormData((prev) => ({ ...prev, accountId: initialAccountId }));
    }
  }, [initialAccountId]);

  const handleChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.value ||
      (!formData.accountId && formData.entryType !== "transfer")
    ) {
      alert("Please fill in required fields (Amount and Account)");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <div className="entry-type-buttons">
        {["income", "expense", "transfer"].map((type) => (
          <button
            key={type}
            type="button"
            className={`${type} ${formData.entryType === type ? "active" : ""}`}
            onClick={() => handleChange("entryType", type as any)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="number"
        placeholder="0.00"
        required
        value={formData.value}
        onChange={(e) => handleChange("value", e.target.value)}
      />

      {formData.entryType === "transfer" ? (
        <div className="row">
          <select
            required
            value={formData.fromAccount}
            onChange={(e) => handleChange("fromAccount", e.target.value)}
          >
            <option value="">From Account</option>
            {accounts.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} (₹{a.balance})
              </option>
            ))}
          </select>
          <select
            required
            value={formData.toAccount}
            onChange={(e) => handleChange("toAccount", e.target.value)}
          >
            <option value="">To Account</option>
            {accounts.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} (₹{a.balance})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <select
          required
          value={formData.accountId}
          onChange={(e) => handleChange("accountId", e.target.value)}
        >
          <option value="">Select Account</option>
          {accounts.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name} (₹{a.balance})
            </option>
          ))}
        </select>
      )}

      <div className="row">
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>

      {formData.entryType !== "transfer" && (
        <select
          required
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="">Select Category</option>
          {CATEGORIES.filter(
            (c) => !c.parentId && c.type === formData.entryType,
          ).map((main) => (
            <optgroup key={main.id} label={`${main.icon} ${main.name}`}>
              {CATEGORIES.filter((sub) => sub.parentId === main.id).map(
                (sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.icon} {sub.name}
                  </option>
                ),
              )}
            </optgroup>
          ))}
        </select>
      )}

      <div className="actions mt-4">
        <button type="button" onClick={onCancel} className="secondary">
          Cancel
        </button>
        <button type="submit" className="primary">
          Save Transaction
        </button>
      </div>
    </Form>
  );
}
