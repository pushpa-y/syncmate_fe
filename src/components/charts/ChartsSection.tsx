import { useState, useMemo, useEffect, useRef, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../context/Authcontext";
import {
  selectTotalBalance,
  selectAccounts,
} from "../../redux/selectors/accountSelectors";
// 2. Import the action creator
import { listAccounts } from "../../redux/actions/accountActions";

import {
  PieChart,
  Pie,
  Label,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import type { Entry } from "../../services/Entry";
import { CATEGORY_MAP } from "../../constants/categories";

import {
  ChartsContainer,
  FilterSection,
  ChartsGrid,
  ChartCard,
  MonthSelector,
  MonthButton,
  EmptyState,
  ChartTitle,
  SummaryContainer,
  SummaryCard,
  DropdownMenu,
  DropdownItem,
  RelativeWrapper,
} from "../../styles/ChartsSection";
import type { Account } from "../../services/accounts";

type Props = {
  entries: Entry[];
};

const COLORS = ["#6366F1", "#F59E0B", "#EF4444", "#06B6D4", "#8B5CF6"];

const formatAmount = (value: number) =>
  value >= 100000
    ? `${(value / 100000).toFixed(1)}L`
    : value >= 1000
    ? `${(value / 1000).toFixed(0)}k`
    : value.toString();

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

function useAnimatedNumber(value: number, duration = 600) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimated(end);
        clearInterval(timer);
      } else setAnimated(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return animated;
}

export default function ChartsSection({ entries }: Props) {
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);

  const accounts = useSelector(selectAccounts);
  const totalBalance = useSelector(selectTotalBalance);
  const animatedTotal = useAnimatedNumber(totalBalance);

  useEffect(() => {
    if (auth?.token) {
      dispatch(listAccounts(auth.token) as any);
    }
  }, [dispatch, auth?.token]);

  const now = new Date();
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ---------- STATE ---------- */
  const [selectedMonth, setSelectedMonth] = useState({
    month: now.getMonth(),
    year: now.getFullYear(),
    label: now.toLocaleString("en-IN", { month: "short", year: "numeric" }),
  });
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* ---------- CLOSE DROPDOWN ON OUTSIDE CLICK ---------- */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as any)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- GENERATE MONTHS ---------- */
  const monthsList = useMemo(() => {
    const months = [];
    for (let i = 0; i < 24; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: d.getMonth(),
        year: d.getFullYear(),
        label: d.toLocaleString("en-IN", { month: "short", year: "numeric" }),
      });
    }
    return months;
  }, []);

  /* ---------- FILTER & PROCESS DATA ---------- */
  const processedData = useMemo(() => {
    const currentMonthEntries = entries.filter((e) => {
      if (!e.dueDate) return false;
      const [y, m] = e.dueDate.split("-").map(Number);

      const isCorrectMonth =
        m === selectedMonth.month + 1 && y === selectedMonth.year;
      const isCorrectAccount =
        selectedAccountId === "all" ||
        e.accountId === selectedAccountId ||
        e.fromAccountId === selectedAccountId ||
        e.toAccountId === selectedAccountId;

      return isCorrectMonth && isCorrectAccount;
    });

    const expMap: Record<string, number> = {};
    const incMap: Record<string, number> = {};
    const trendMap: Record<string, { income: number; expense: number }> = {};

    currentMonthEntries.forEach((e) => {
      const val = Number(e.value) || 0;
      const meta = CATEGORY_MAP[e.category as keyof typeof CATEGORY_MAP];
      const parentName = meta?.parent || "Other";
      const dateKey = e.dueDate!;

      if (!trendMap[dateKey]) trendMap[dateKey] = { income: 0, expense: 0 };

      if (e.entryType === "expense") {
        expMap[parentName] = (expMap[parentName] || 0) + val;
        trendMap[dateKey].expense += val;
      } else if (e.entryType === "income") {
        incMap[parentName] = (incMap[parentName] || 0) + val;
        trendMap[dateKey].income += val;
      }
    });

    return {
      filteredEntries: currentMonthEntries,
      expenseByCat: Object.entries(expMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      totalIn: Object.values(incMap).reduce((a, b) => a + b, 0),
      totalOut: Object.values(expMap).reduce((a, b) => a + b, 0),
      trendData: Object.entries(trendMap)
        .map(([date, vals]) => ({ date, ...vals }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  }, [entries, selectedMonth, selectedAccountId]);

  const { filteredEntries, expenseByCat, totalIn, totalOut, trendData } =
    processedData;
  const animatedIn = useAnimatedNumber(totalIn);
  const animatedOut = useAnimatedNumber(totalOut);
  const netSavings = totalIn - totalOut;

  return (
    <ChartsContainer>
      <FilterSection>
        {/* 1. ACCOUNT FILTER CHIPS */}
        <MonthSelector>
          <MonthButton
            $active={selectedAccountId === "all"}
            onClick={() => setSelectedAccountId("all")}
          >
            All Accounts
          </MonthButton>
          {accounts &&
            accounts.map((acc: Account) => (
              <MonthButton
                key={acc._id}
                $active={selectedAccountId === acc._id}
                onClick={() => setSelectedAccountId(acc._id)}
              >
                {acc.name}
              </MonthButton>
            ))}
        </MonthSelector>

        {/* 2. MONTH SELECTOR */}
        <MonthSelector>
          {monthsList.slice(0, 3).map((m) => (
            <MonthButton
              key={m.label}
              $active={m.label === selectedMonth.label}
              onClick={() => setSelectedMonth(m)}
            >
              {m.label}
            </MonthButton>
          ))}
          <RelativeWrapper ref={dropdownRef}>
            <MonthButton
              $active={false}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              ⋯
            </MonthButton>
            {dropdownOpen && (
              <DropdownMenu>
                {monthsList.slice(3, 15).map((m) => (
                  <DropdownItem
                    key={m.label}
                    onClick={() => {
                      setSelectedMonth(m);
                      setDropdownOpen(false);
                    }}
                  >
                    {m.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </RelativeWrapper>
        </MonthSelector>
      </FilterSection>

      {filteredEntries.length === 0 ? (
        <EmptyState>📭 No data found for {selectedMonth.label}</EmptyState>
      ) : (
        <>
          {/* 3. CASH FLOW SUMMARY */}
          <SummaryContainer>
            <SummaryCard $color="#22C55E">
              <p>Total Income</p>
              <h3>₹{animatedIn.toLocaleString()}</h3>
            </SummaryCard>
            <SummaryCard $color="#EF4444">
              <p>Total Expense</p>
              <h3>₹{animatedOut.toLocaleString()}</h3>
            </SummaryCard>
            <SummaryCard $color="#6366F1">
              <p>Net Balance</p>
              <h3>₹{netSavings.toLocaleString()}</h3>
            </SummaryCard>
          </SummaryContainer>

          <ChartsGrid>
            {/* 4. PIE CHART */}
            <ChartCard>
              <ChartTitle>Expense Distribution</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseByCat}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    stroke="none"
                  >
                    {expenseByCat.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                    <Label
                      value={`₹${animatedTotal.toLocaleString()}`}
                      position="center"
                      fill="#0f172a"
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        fontFamily: "Inter",
                      }}
                    />
                    <Label
                      value="Total Balance"
                      position="center"
                      dy={24}
                      fill="#64748b"
                      style={{
                        fontSize: "11px",
                        fontWeight: "500",
                        textTransform: "uppercase",
                      }}
                    />
                  </Pie>
                  <Tooltip formatter={(v: any) => `₹${v.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* 5. TREND LINE */}
            <ChartCard>
              <ChartTitle>Income vs Expense Trend</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatAmount}
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* 6. HORIZONTAL BAR CHART */}
            <ChartCard className="full-width">
              <ChartTitle>Spending by Category</ChartTitle>
              <ResponsiveContainer
                width="100%"
                height={Math.max(expenseByCat.length * 45, 250)}
              >
                <BarChart layout="vertical" data={expenseByCat}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    formatter={(v: any) => `₹${v.toLocaleString()}`}
                  />
                  <Bar
                    dataKey="value"
                    fill="#6366F1"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                    label={{
                      position: "right",
                      formatter: (v: any) =>
                        typeof v === "number" ? `₹${formatAmount(v)}` : v,
                      fontSize: 11,
                      fill: "#6B7280",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </ChartsGrid>
        </>
      )}
    </ChartsContainer>
  );
}
