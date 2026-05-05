"use client";

import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  HRAnalytics, HRDashboardStats,
  UpcomingBirthday, UpcomingAnniversary, UpcomingLeave, ShiftStat, AbsenceReason,
} from "@/models/hrms";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  Users, UserCheck, UserX, TreePalm, Clock, Zap, Timer, UserPlus,
  Building2, TrendingUp, TrendingDown, AlertTriangle, Activity,
  Gift, Star, CalendarDays, ChevronRight, BarChart2,
  FileText, Settings, ClipboardList, LogOut, Bell,
  Brain, Cake, Award, ToggleRight,
} from "lucide-react";

// ─── Palette ──────────────────────────────────────────────
const C = {
  green:  "#10b981",
  red:    "#ef4444",
  amber:  "#f59e0b",
  blue:   "#3b82f6",
  purple: "#8b5cf6",
  cyan:   "#06b6d4",
  indigo: "#6366f1",
  rose:   "#f43f5e",
  DONUT:  ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
};

// ─── Tooltip ──────────────────────────────────────────────
function ChartTip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 py-0.5">
          <span className="h-2 w-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-gray-600 capitalize">{p.name.replace(/_/g, " ")}:</span>
          <span className="font-semibold text-gray-900 ml-auto pl-3">
            {typeof p.value === "number" && p.value % 1 !== 0 ? p.value.toFixed(1) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Health Score SVG Gauge ────────────────────────────────
function HealthGauge({ pct }: { pct: number }) {
  const score = Math.round(pct);
  const color = score >= 75 ? C.green : score >= 50 ? C.amber : C.red;
  const label = score >= 75 ? "Good" : score >= 50 ? "Average" : "Poor";
  const dash = (score / 100) * 251;
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="relative h-40 w-40">
        <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${dash} 251`}
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-gray-900">{score}</span>
          <span className="text-xs font-medium" style={{ color }}>{label}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Attendance Health Score</p>
    </div>
  );
}

// ─── Half-ring Gauge (for Absenteeism) ────────────────────
function HalfGauge({ pct, color, label }: { pct: number; color: string; label: string }) {
  const capped = Math.min(pct, 100);
  const dash = (capped / 100) * 125;
  return (
    <div className="flex flex-col items-center py-2">
      <div className="relative h-24 w-48 overflow-hidden">
        <svg className="h-48 w-48 -rotate-180" viewBox="0 0 100 100" style={{ marginTop: -96 }}>
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f3f4f6" strokeWidth="10" strokeLinecap="round" />
          <path
            d="M 10 50 A 40 40 0 0 1 90 50" fill="none"
            stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${dash} 125`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-end justify-center pr-16">
          <span className="text-2xl font-extrabold" style={{ color }}>{pct.toFixed(1)}%</span>
          <span className="text-xs text-gray-500">{label}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Circular Progress (Shift Wise) ───────────────────────
function ShiftCircle({ shift, pct, color }: { shift: string; pct: number; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-20 w-20">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#f3f4f6" strokeWidth="7" />
          <circle
            cx="36" cy="36" r={r} fill="none"
            stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900">{pct}%</span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-600">{shift}</span>
    </div>
  );
}

// ─── Delta Badge ──────────────────────────────────────────
function Delta({ today, yesterday }: { today: number; yesterday: number }) {
  if (yesterday === 0) return null;
  const diff = today - yesterday;
  const pct = Math.abs(Math.round((diff / yesterday) * 100));
  const up = diff >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {pct}% vs yday
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────
function KpiCard({
  label, value, sub, pct, delta, icon: Icon, iconBg, iconColor, yesterday,
}: {
  label: string;
  value: number | string;
  sub?: string;
  pct?: number;
  delta?: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  yesterday?: number;
}) {
  return (
    <Card>
      <CardContent className="py-5">
        <div className="flex items-start justify-between">
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          {yesterday !== undefined && delta !== undefined && (
            <Delta today={delta} yesterday={yesterday} />
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-extrabold text-gray-900">{value}</p>
          {pct !== undefined && (
            <p className="text-xs font-semibold text-gray-500">{pct.toFixed(2)}%</p>
          )}
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── AI Insights Generator ────────────────────────────────
function generateInsights(stats: HRDashboardStats, analytics: HRAnalytics): { level: "alert" | "warn" | "info"; text: string }[] {
  const insights: { level: "alert" | "warn" | "info"; text: string }[] = [];
  const pct = stats.total_employees > 0
    ? (stats.present_today / stats.total_employees) * 100
    : 0;

  if (pct < 60) {
    insights.push({ level: "alert", text: `Critical: Only ${pct.toFixed(0)}% attendance today — immediate action recommended.` });
  } else if (pct < 75) {
    insights.push({ level: "warn", text: `Attendance is at ${pct.toFixed(1)}% — below the 75% target threshold.` });
  } else {
    insights.push({ level: "info", text: `Attendance is healthy at ${pct.toFixed(1)}% today.` });
  }

  if (analytics.kpis.late_logins > 0 && stats.present_today > 0) {
    const latePct = Math.round((analytics.kpis.late_logins / stats.present_today) * 100);
    if (latePct > 20) {
      insights.push({ level: "warn", text: `${latePct}% of present employees arrived late today (${analytics.kpis.late_logins} staff).` });
    } else {
      insights.push({ level: "info", text: `${analytics.kpis.late_logins} late arrivals today (${latePct}% of present staff).` });
    }
  }

  if (stats.on_leave_today > 0) {
    insights.push({ level: "info", text: `${stats.on_leave_today} employee${stats.on_leave_today > 1 ? "s" : ""} on approved leave today.` });
  }

  if (stats.recent_hires > 0) {
    insights.push({ level: "info", text: `${stats.recent_hires} new hire${stats.recent_hires > 1 ? "s" : ""} joined in the last 30 days.` });
  }

  if ((stats.upcoming_birthdays?.length ?? 0) > 0) {
    const bdays = stats.upcoming_birthdays!;
    const names = bdays.slice(0, 2).map((b) => b.name.split(" ")[0]).join(", ");
    insights.push({ level: "info", text: `Upcoming birthdays this week: ${names}${bdays.length > 2 ? ` +${bdays.length - 2} more` : ""}.` });
  }

  if (analytics.kpis.overtime_hours > 20) {
    insights.push({ level: "warn", text: `High overtime today: ${analytics.kpis.overtime_hours}h logged — check workload distribution.` });
  }

  return insights.slice(0, 5);
}

// ─── Status Badge ─────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toUpperCase();
  const map: Record<string, string> = {
    APPROVED: "bg-emerald-100 text-emerald-700",
    PENDING:  "bg-amber-100 text-amber-700",
    REJECTED: "bg-red-100 text-red-700",
    PENDING_APPROVAL: "bg-blue-100 text-blue-700",
  };
  const cls = map[s] || "bg-gray-100 text-gray-600";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {s.charAt(0) + s.slice(1).toLowerCase()}
    </span>
  );
}

// ─── Quick Actions ─────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Reports",     Icon: FileText,      color: "bg-indigo-50 text-indigo-600" },
  { label: "Leave Mgmt",  Icon: CalendarDays,  color: "bg-emerald-50 text-emerald-600" },
  { label: "Attendance",  Icon: ClipboardList, color: "bg-blue-50 text-blue-600" },
  { label: "Recruitment", Icon: UserPlus,      color: "bg-purple-50 text-purple-600" },
  { label: "Settings",    Icon: Settings,      color: "bg-gray-50 text-gray-600" },
  { label: "Alerts",      Icon: Bell,          color: "bg-amber-50 text-amber-600" },
  { label: "Payroll",     Icon: LogOut,        color: "bg-rose-50 text-rose-600" },
];

// ─── Main HR Dashboard ────────────────────────────────────
export function HRDashboard({
  stats,
  analytics,
  onSwitch,
}: {
  stats: HRDashboardStats;
  analytics: HRAnalytics | null;
  onSwitch: () => void;
}) {
  const kpis = analytics?.kpis;
  const daily14 = (analytics?.daily_attendance ?? []).slice(-14);
  const monthly = analytics?.monthly_attendance ?? [];
  const insights = analytics ? generateInsights(stats, analytics) : [];
  const attendancePct = stats.total_employees > 0
    ? (stats.present_today / stats.total_employees) * 100
    : 0;
  const absentPct = stats.total_employees > 0
    ? (stats.absent_today / stats.total_employees) * 100
    : 0;

  // Shift-wise: if no shift data, synthesise one row from overall
  const shiftData: ShiftStat[] = stats.shift_wise?.length
    ? stats.shift_wise
    : [{ shift: "Overall", present: stats.present_today, total: stats.total_employees, pct: parseFloat(attendancePct.toFixed(1)) }];

  const shiftColors = [C.green, C.blue, C.purple, C.amber, C.cyan];

  // Top reasons donut
  const reasonData: AbsenceReason[] = stats.top_reasons?.length
    ? stats.top_reasons
    : [{ reason: "No Data", count: 1 }];

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-sm text-gray-500">Organization-wide overview · {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <button
          onClick={onSwitch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-sm font-medium"
        >
          <ToggleRight className="h-5 w-5" />
          Switch to Personal
        </button>
      </div>

      {/* ── Row 1: Health Score + 4 Main KPIs ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {/* Health score */}
        <Card className="sm:col-span-1">
          <CardContent className="p-0">
            <HealthGauge pct={attendancePct} />
          </CardContent>
        </Card>

        {/* Total Employees */}
        <KpiCard
          label="Total Employees"
          value={stats.total_employees}
          icon={Users}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />

        {/* Present */}
        <KpiCard
          label="Present Today"
          value={stats.present_today}
          pct={attendancePct}
          delta={stats.present_today}
          yesterday={stats.yesterday_present}
          icon={UserCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        {/* Absent */}
        <KpiCard
          label="Absent Today"
          value={stats.absent_today}
          pct={absentPct}
          delta={stats.absent_today}
          yesterday={stats.yesterday_absent}
          icon={UserX}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />

        {/* On Leave */}
        <KpiCard
          label="On Leave"
          value={stats.on_leave_today}
          pct={stats.total_employees > 0 ? (stats.on_leave_today / stats.total_employees) * 100 : 0}
          delta={stats.on_leave_today}
          yesterday={stats.yesterday_on_leave}
          icon={TreePalm}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* ── Row 2: Secondary KPIs ─────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{kpis?.late_logins ?? stats.late_today}</p>
              <p className="text-xs text-gray-500">Late Logins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{kpis?.early_logins ?? (stats.present_today - stats.late_today)}</p>
              <p className="text-xs text-gray-500">On-Time Logins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <Timer className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{kpis?.overtime_hours ?? 0}h</p>
              <p className="text-xs text-gray-500">Overtime Hours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
              <UserPlus className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.recent_hires}</p>
              <p className="text-xs text-gray-500">New Joiners / 30d</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Dept Breakdown | Trend | Monthly | AI Insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Department Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-600" />
              <h2 className="text-sm font-semibold text-gray-900">Department Breakdown</h2>
            </div>
          </CardHeader>
          <CardContent>
            {stats.department_breakdown.length === 0 ? (
              <p className="text-xs text-gray-400 py-4">No data</p>
            ) : (
              <div className="space-y-2.5">
                {stats.department_breakdown.slice(0, 8).map((dept, i) => {
                  const rate = dept.total > 0 ? Math.round((dept.present / dept.total) * 100) : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="font-medium text-gray-700 truncate max-w-25">{dept.department}</span>
                        <span className="text-gray-400">{dept.present}/{dept.total}</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${rate}%` }} />
                        <div className="h-full bg-red-300" style={{ width: `${100 - rate}%` }} />
                      </div>
                    </div>
                  );
                })}
                <div className="flex gap-3 pt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-500"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Present</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500"><span className="h-2 w-2 rounded-full bg-red-300 inline-block" /> Absent</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Trend — 14-day line */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-gray-900">Attendance Trend</h2>
              <span className="ml-auto text-xs text-gray-400">14d</span>
            </div>
          </CardHeader>
          <CardContent>
            {daily14.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={daily14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={2} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="on_time" name="On Time" stroke={C.green} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="late" name="Late" stroke={C.amber} strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="absent" name="Absent" stroke={C.red} strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Monthly Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-gray-900">Monthly Overview</h2>
              <span className="ml-auto text-xs text-gray-400">6m</span>
            </div>
          </CardHeader>
          <CardContent>
            {monthly.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthly} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} allowDecimals={false} />
                  <Tooltip content={<ChartTip />} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="available" name="Present" fill={C.green} stackId="a" />
                  <Bar dataKey="on_leave" name="Leave" fill={C.cyan} stackId="a" />
                  <Bar dataKey="late_clockin" name="Late" fill={C.amber} stackId="a" />
                  <Bar dataKey="absent" name="Absent" fill={C.red} stackId="a" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* HR AI Insights */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-semibold text-gray-900">HR AI Insights</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.length === 0 ? (
                <p className="text-xs text-gray-400">No insights available.</p>
              ) : (
                insights.map((ins, i) => {
                  const colors = {
                    alert: "border-l-red-500 bg-red-50",
                    warn:  "border-l-amber-500 bg-amber-50",
                    info:  "border-l-indigo-400 bg-indigo-50",
                  };
                  const iconColors = {
                    alert: "text-red-500",
                    warn:  "text-amber-600",
                    info:  "text-indigo-500",
                  };
                  const icons = {
                    alert: AlertTriangle,
                    warn:  AlertTriangle,
                    info:  Activity,
                  };
                  const Icon = icons[ins.level];
                  return (
                    <div key={i} className={`flex gap-2 border-l-4 rounded-r-lg px-3 py-2 ${colors[ins.level]}`}>
                      <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${iconColors[ins.level]}`} />
                      <p className="text-xs text-gray-700 leading-snug">{ins.text}</p>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 4: Absenteeism | Top Reasons | Shift Wise | Turnover ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Absenteeism Gauge */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h2 className="text-sm font-semibold text-gray-900">Absenteeism Rate</h2>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <HalfGauge pct={parseFloat(absentPct.toFixed(2))} color={C.red} label="Today" />
            <p className="text-xs text-gray-500 text-center mt-1">
              {stats.absent_today} of {stats.total_employees} absent
            </p>
          </CardContent>
        </Card>

        {/* Top Reasons Donut */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-cyan-600" />
              <h2 className="text-sm font-semibold text-gray-900">Top Absence Reasons</h2>
              <span className="ml-auto text-xs text-gray-400">YTD</span>
            </div>
          </CardHeader>
          <CardContent>
            {reasonData[0].reason === "No Data" ? (
              <p className="text-xs text-gray-400 py-8 text-center">No leave data</p>
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={reasonData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    dataKey="count"
                    nameKey="reason"
                  >
                    {reasonData.map((_, i) => (
                      <Cell key={i} fill={C.DONUT[i % C.DONUT.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="space-y-1 mt-1">
              {reasonData.slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: C.DONUT[i % C.DONUT.length] }} />
                  <span className="text-gray-600 truncate">{r.reason}</span>
                  <span className="ml-auto font-semibold text-gray-800">{r.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shift Wise Attendance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-gray-900">Shift-wise Attendance</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-around gap-3 py-2">
              {shiftData.slice(0, 4).map((s, i) => (
                <ShiftCircle key={i} shift={s.shift} pct={s.pct} color={shiftColors[i % shiftColors.length]} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Turnover */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-rose-500" />
              <h2 className="text-sm font-semibold text-gray-900">Employee Turnover</h2>
              <span className="ml-auto text-xs text-gray-400">YTD</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <span className="text-4xl font-extrabold text-rose-500">{stats.turnover_ytd ?? 0}%</span>
            <p className="text-xs text-gray-500 mt-2 text-center">Based on inactive vs total headcount</p>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-rose-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(stats.turnover_ytd ?? 0, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 5: Birthdays | Quick Actions | Anniversaries ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Birthdays */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cake className="h-4 w-4 text-pink-500" />
              <h2 className="text-sm font-semibold text-gray-900">Upcoming Birthdays</h2>
            </div>
          </CardHeader>
          <CardContent>
            {stats.upcoming_birthdays?.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No birthdays in next 14 days</p>
            ) : (
              <div className="space-y-2.5">
                {(stats.upcoming_birthdays ?? []).map((b: UpcomingBirthday, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
                      <Gift className="h-4 w-4 text-pink-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-800 truncate">{b.name}</p>
                      <p className="text-xs text-gray-400">{b.dept}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-pink-600">{b.date}</p>
                      <p className="text-xs text-gray-400">
                        {b.days_until === 0 ? "Today!" : `in ${b.days_until}d`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {QUICK_ACTIONS.map(({ label, Icon, color }) => (
                <button
                  key={label}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${color} hover:scale-105 transition-transform`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work Anniversaries */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-gray-900">Work Anniversaries</h2>
            </div>
          </CardHeader>
          <CardContent>
            {stats.upcoming_anniversaries?.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No anniversaries in next 14 days</p>
            ) : (
              <div className="space-y-2.5">
                {(stats.upcoming_anniversaries ?? []).map((a: UpcomingAnniversary, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                      <Star className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-800 truncate">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.dept}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-amber-600">{a.years} yr{a.years > 1 ? "s" : ""}</p>
                      <p className="text-xs text-gray-400">
                        {a.days_until === 0 ? "Today!" : `in ${a.days_until}d`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 6: Upcoming Leave Requests ───────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-semibold text-gray-900">Upcoming Leave Requests</h2>
            <span className="ml-auto text-xs text-gray-400">Next 30 days</span>
          </div>
        </CardHeader>
        <CardContent>
          {!stats.upcoming_leaves?.length ? (
            <p className="text-xs text-gray-400 py-4 text-center">No upcoming leave requests</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-2 px-3 text-left font-semibold text-gray-500">Employee</th>
                    <th className="py-2 px-3 text-left font-semibold text-gray-500">Department</th>
                    <th className="py-2 px-3 text-left font-semibold text-gray-500">From</th>
                    <th className="py-2 px-3 text-left font-semibold text-gray-500">To</th>
                    <th className="py-2 px-3 text-center font-semibold text-gray-500">Days</th>
                    <th className="py-2 px-3 text-center font-semibold text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.upcoming_leaves ?? []).map((lv: UpcomingLeave, i: number) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-3 font-medium text-gray-800">{lv.name}</td>
                      <td className="py-2 px-3 text-gray-500">{lv.dept}</td>
                      <td className="py-2 px-3 text-gray-600">{lv.from_date}</td>
                      <td className="py-2 px-3 text-gray-600">{lv.to_date}</td>
                      <td className="py-2 px-3 text-center font-semibold text-gray-700">{lv.days}</td>
                      <td className="py-2 px-3 text-center"><StatusBadge status={lv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Keep backward-compat export (still used for analytics-only display if needed)
export function HRDashboardCharts({ data }: { data: HRAnalytics }) {
  const kpis = data.kpis;
  const daily14 = data.daily_attendance.slice(-14);
  const monthly = data.monthly_attendance;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Late Logins", value: kpis.late_logins, icon: Clock, color: "bg-amber-50 text-amber-600" },
          { label: "On-Time Logins", value: kpis.early_logins, icon: Zap, color: "bg-emerald-50 text-emerald-600" },
          { label: "Overtime (h)", value: kpis.overtime_hours, icon: Timer, color: "bg-purple-50 text-purple-600" },
          { label: "Unapproved Leaves", value: kpis.unapproved_leaves, icon: AlertTriangle, color: "bg-red-50 text-red-600" },
          { label: "Avg Work Hrs", value: kpis.avg_work_hrs, icon: Activity, color: "bg-cyan-50 text-cyan-600" },
          { label: "Attendance %", value: `${kpis.attendance_pct}%`, icon: TrendingUp, color: "bg-indigo-50 text-indigo-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="py-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><BarChart2 className="h-5 w-5 text-blue-600" /><h2 className="text-base font-semibold text-gray-900">Attendance Status</h2><span className="ml-auto text-xs text-gray-400">Last 14 days</span></div></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={daily14} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={1} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip content={<ChartTip />} /><Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="on_time" name="On Time" fill={C.green} radius={[3, 3, 0, 0]} />
                <Bar dataKey="late" name="Late" fill={C.amber} radius={[3, 3, 0, 0]} />
                <Bar dataKey="absent" name="Absent" fill={C.blue} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-600" /><h2 className="text-base font-semibold text-gray-900">Overall Attendance %</h2><span className="ml-auto text-xs text-gray-400">Last 6 months</span></div></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                <Tooltip content={<ChartTip />} />
                <Line type="monotone" dataKey="attendance_pct" name="Attendance %" stroke={C.green} strokeWidth={2.5} dot={{ r: 5, fill: C.green }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
