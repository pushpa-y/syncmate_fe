export interface Category {
  id: string;
  name: string;
  parentId?: string;
  icon: string;
  type: "income" | "expense";
}

export const CATEGORIES: Category[] = [
  // --- INCOME CATEGORIES ---
  { id: "inc_main", name: "Income", icon: "💰", type: "income" },
  {
    id: "salary",
    name: "Salary",
    parentId: "inc_main",
    icon: "💼",
    type: "income",
  },
  {
    id: "freelance",
    name: "Freelance",
    parentId: "inc_main",
    icon: "💻",
    type: "income",
  },
  {
    id: "investment",
    name: "Investments",
    parentId: "inc_main",
    icon: "📈",
    type: "income",
  },
  {
    id: "gift",
    name: "Gifts/Other",
    parentId: "inc_main",
    icon: "🎁",
    type: "income",
  },

  // --- EXPENSE CATEGORIES ---
  // FOOD & DRINKS
  { id: "food", name: "Food & Drinks", icon: "🍔", type: "expense" },
  {
    id: "food_groceries",
    name: "Groceries",
    parentId: "food",
    icon: "🛒",
    type: "expense",
  },
  {
    id: "food_cafe",
    name: "Cafe",
    parentId: "food",
    icon: "☕",
    type: "expense",
  },
  {
    id: "food_restaurant",
    name: "Restaurant",
    parentId: "food",
    icon: "🍽",
    type: "expense",
  },
  {
    id: "food_bar",
    name: "Bar",
    parentId: "food",
    icon: "🍺",
    type: "expense",
  },

  // SHOPPING
  { id: "shopping", name: "Shopping", icon: "🛍", type: "expense" },
  {
    id: "shopping_clothes",
    name: "Clothes",
    parentId: "shopping",
    icon: "👗",
    type: "expense",
  },
  {
    id: "shopping_electronics",
    name: "Electronics",
    parentId: "shopping",
    icon: "📱",
    type: "expense",
  },

  // TRANSPORT
  { id: "transport", name: "Transport", icon: "🚗", type: "expense" },
  {
    id: "transport_fuel",
    name: "Fuel",
    parentId: "transport",
    icon: "⛽",
    type: "expense",
  },
  {
    id: "transport_taxi",
    name: "Taxi",
    parentId: "transport",
    icon: "🚕",
    type: "expense",
  },

  // FINANCIAL
  { id: "financial", name: "Financial Expenses", icon: "💳", type: "expense" },
  {
    id: "financial_rent",
    name: "Rent",
    parentId: "financial",
    icon: "🏠",
    type: "expense",
  },
  {
    id: "financial_bills",
    name: "Bills",
    parentId: "financial",
    icon: "📄",
    type: "expense",
  },

  // ENTERTAINMENT
  { id: "entertainment", name: "Entertainment", icon: "🎉", type: "expense" },
  {
    id: "entertainment_movies",
    name: "Movies",
    parentId: "entertainment",
    icon: "🎬",
    type: "expense",
  },
];

/**
 * AUTO-GENERATED MAP
 * This builds your CATEGORY_MAP automatically from the array above
 */
export const CATEGORY_MAP: Record<
  string,
  { label: string; emoji: string; parent: string }
> = CATEGORIES.reduce((acc, cat) => {
  if (cat.parentId) {
    const parentCat = CATEGORIES.find((p) => p.id === cat.parentId);
    acc[cat.id] = {
      label: cat.name,
      emoji: cat.icon,
      parent: parentCat ? parentCat.name : "Other",
    };
  }
  return acc;
}, {} as any);

// Add fallback manually
CATEGORY_MAP["other"] = { label: "Other", emoji: "📦", parent: "Other" };
