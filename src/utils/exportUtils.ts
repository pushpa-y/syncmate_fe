import type { Entry } from "../services/Entry";

/**
 * Exports entries to CSV, mapping account IDs to human-readable names
 * @param entries - The list of entries to export
 * @param accounts - The list of account objects for ID-to-Name mapping
 */
export const exportToCSV = (entries: Entry[], accounts: any[]) => {
  if (!entries || entries.length === 0) {
    alert("No data available to export");
    return;
  }

  const headers = ["Date", "Type", "Category", "Amount", "Account", "Notes"];
  const rows = entries.map((entry) => {
    const accountId = entry.accountId || entry.baseAccount || entry.fromAccount;

    // Find the account name in the accounts list
    const accountObj = accounts.find((acc) => acc._id === accountId);
    const accountName = accountObj ? accountObj.name : "N/A";

    return [
      entry.dueDate ? new Date(entry.dueDate).toLocaleDateString() : "N/A",
      entry.entryType?.toUpperCase() || "N/A",
      entry.category || "General",
      entry.value || 0,
      accountName,
      `"${(entry.notes || "").replace(/"/g, '""')}"`, // Escape quotes for CSV safety
    ];
  });

  // 3. Create CSV Content
  const csvString = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // 4. Trigger Download
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `SyncMate_Export_${new Date().toISOString().split("T")[0]}.csv`,
  );
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
