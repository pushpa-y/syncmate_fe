import { useState, useMemo, useEffect, useRef, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../context/Authcontext";
import {
  selectAccounts,
  selectActiveAccount,
} from "../../redux/selectors/appSelectors";
import { listAccounts } from "../../redux/actions/accountActions";

import {
  PieChart,
  Pie,
  Label,
  LabelList,
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

import { useTheme } from "styled-components";
import {
  ChartsContainer,
  FilterSection,
  ChartsGrid,
  ChartCard,
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
  const theme = useTheme();
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);

  const accounts = useSelector(selectAccounts);
  const activeAccountId = useSelector(selectActiveAccount);

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

  const activeAccountName = useMemo(() => {
    if (activeAccountId === "all") return "All Accounts";
    const acc = accounts.find((a: Account) => a._id === activeAccountId);
    return acc ? acc.name : "Selected Account";
  }, [activeAccountId, accounts]);

  const processedData = useMemo(() => {
    const currentMonthEntries = entries.filter((e) => {
      if (!e.dueDate) return false;
      const [y, m] = e.dueDate.split("-").map(Number);

      const isCorrectMonth =
        m === selectedMonth.month + 1 && y === selectedMonth.year;

      const isCorrectAccount =
        activeAccountId === "all" ||
        e.account === activeAccountId ||
        e.baseAccount === activeAccountId;

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
  }, [entries, selectedMonth, activeAccountId]);

  const { filteredEntries, expenseByCat, totalIn, totalOut, trendData } =
    processedData;
  const animatedIn = useAnimatedNumber(totalIn);
  const animatedOut = useAnimatedNumber(totalOut);
  const netSavings = totalIn - totalOut;

  return (
    <ChartsContainer>
      <FilterSection className="glass-filter-bar">
        <div className="filter-group">
          <span className="filter-label" style={{ color: theme.accent }}>
            Context
          </span>
          <div
            style={{ fontSize: "14px", fontWeight: "600", color: theme.text }}
          >
            Showing activity for{" "}
            <span style={{ color: theme.accent }}>{activeAccountName}</span> in{" "}
            {selectedMonth.label}
          </div>
        </div>
        <div className="filter-divider" />
        {/* Month Segmented Control */}
        <div className="filter-group">
          <span className="filter-label">Time Period</span>
          <div className="segmented-control">
            {monthsList.slice(0, 3).map((m) => (
              <button
                key={m.label}
                className={m.label === selectedMonth.label ? "active" : ""}
                onClick={() => setSelectedMonth(m)}
              >
                {m.label}
              </button>
            ))}

            {/* More Months Dropdown */}
            <RelativeWrapper ref={dropdownRef} style={{ display: "flex" }}>
              <button
                className="more-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                ⋯
              </button>
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
          </div>
        </div>
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
                      value={`₹${animatedOut.toLocaleString()}`}
                      position="center"
                      fill={theme.text}
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        fontFamily: "Inter",
                      }}
                    />
                    <Label
                      value="Total spending"
                      position="center"
                      dy={24}
                      fill={theme.muted}
                      style={{
                        fontSize: "11px",
                        fontWeight: "500",
                      }}
                    />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.sidebarBg,
                      borderColor: theme.glassBorder,
                      color: theme.text,
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: theme.text }}
                    formatter={(v: any) => `₹${v.toLocaleString()}`}
                  />
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
                    stroke={theme.glassBorder}
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.cardBg,
                      border: `1px solid ${theme.glassBorder}`,
                      borderRadius: "8px",
                      color: theme.text,
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: theme.text }}
                    labelStyle={{ color: theme.muted, marginBottom: "4px" }}
                  />
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
                height={Math.max(expenseByCat.length * 50, 300)}
              >
                <BarChart
                  layout="vertical"
                  data={expenseByCat}
                  margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop
                        offset="5%"
                        stopColor={theme.accent}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={theme.accent}
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                  </defs>

                  <XAxis type="number" hide />

                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    fontSize={13}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme.text, fontWeight: 500 }}
                  />

                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                    contentStyle={{
                      backgroundColor: theme.cardBg,
                      borderRadius: "12px",
                      border: `1px solid ${theme.glassBorder}`,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(v: any) => `₹${v.toLocaleString()}`}
                  />

                  <Bar
                    dataKey="value"
                    fill="url(#barGradient)"
                    radius={[0, 10, 10, 0]}
                    barSize={32}
                  >
                    <LabelList
                      dataKey="value"
                      position="right"
                      offset={15}
                      formatter={(v: any) => `₹${formatAmount(v)}`}
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        fill: theme.text,
                        fontFamily: "Inter",
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </ChartsGrid>
        </>
      )}
    </ChartsContainer>
  );
}
