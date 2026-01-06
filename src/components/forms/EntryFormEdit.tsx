import React, { useState } from "react";
import type { Account } from "../../services/accounts";
import type { Entry } from "../../services/Entry";
import { Form } from "../../styles/EntryFormEdit";
import { CATEGORIES } from "../../constants/categories";

type Props = {
  entry: Entry;
  accounts: Account[];
  onSubmit: (id: string, updatedData: any) => void;
  onCancel: () => void;
};

export default function EntryFormEdit({
  entry,
  accounts,
  onSubmit,
  onCancel,
}: Props) {
  const [formData, setFormData] = useState({
    value: entry.value?.toString() || "",
    entryType:
      (entry.entryType as "income" | "expense" | "transfer") || "expense",
    dueDate: entry.dueDate?.split("T")[0] || "",
    notes: entry.notes || "",
    category: entry.category || "",
    accountId: entry.account || entry.baseAccount || "",
    fromAccount: entry.fromAccount || "",
    toAccount: entry.toAccount || "",
  });

  const handleChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.value ||
      (!formData.accountId && formData.entryType !== "transfer")
    ) {
      alert("Please enter an amount and select an account.");
      return;
    }
    onSubmit(entry._id, formData);
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <div className="entry-type-buttons">
        {["income", "expense", "transfer"].map((type) => (
          <button
            key={type}
            type="button"
            className={`${type} ${formData.entryType === type ? "active" : ""}`}
            onClick={() => handleChange("entryType", type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Amount */}
      <input
        type="number"
        placeholder="Amount"
        required
        value={formData.value}
        onChange={(e) => handleChange("value", e.target.value)}
      />

      {/* Account Selection */}
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
                {a.name}
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
                {a.name}
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
              {a.name}
            </option>
          ))}
        </select>
      )}

      {/* Date & Notes */}
      <div className="row">
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
        />
        <input
          type="text"
          placeholder="Notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>

      {/* Category */}
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
          Update Transaction
        </button>
      </div>
    </Form>
  );
}
