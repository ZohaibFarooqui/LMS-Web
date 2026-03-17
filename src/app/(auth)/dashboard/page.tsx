"use client";

import { useDashboardController } from "@/controllers/useDashboardController";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { LeaveBalanceChart } from "@/components/charts/LeaveBalanceChart";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { formatDate } from "@/lib/utils";
import {
  User,
  Users,
  Building2,
  MapPin,
  Briefcase,
  CalendarDays,
  TreePalm,
  Clock,
  TrendingUp,
  AlertCircle,
  UserCheck,
  UserX,
  AlertTriangle,
  UserPlus,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    dashboard,
    leaveBalances,
    attendanceSummary,
    hrStats,
    hrView,
    setHrView,
    loading,
    error,
  } = useDashboardController();

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // ==================== HR DASHBOARD VIEW ====================
  if (hrView && hrStats) {
    const attendanceRate = hrStats.total_employees > 0
      ? Math.round((hrStats.present_today / hrStats.total_employees) * 100)
      : 0;

    return (
      <div className="animate-fade-in">
        <PageHeader
          title="HR Dashboard"
          subtitle="Organization-wide overview for today"
          actions={
            <button
              onClick={() => setHrView(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-sm font-medium"
            >
              <ToggleRight className="h-5 w-5" />
              Switch to Personal
            </button>
          }
        />

        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="py-5 text-center">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{hrStats.total_employees}</p>
              <p className="text-xs text-gray-500 mt-1">Total Employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5 text-center">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-2">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{hrStats.present_today}</p>
              <p className="text-xs text-gray-500 mt-1">Present Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5 text-center">
              <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-2">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{hrStats.absent_today}</p>
              <p className="text-xs text-gray-500 mt-1">Absent Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5 text-center">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600">{hrStats.late_today}</p>
              <p className="text-xs text-gray-500 mt-1">Late Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5 text-center">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-2">
                <TreePalm className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{hrStats.on_leave_today}</p>
              <p className="text-xs text-gray-500 mt-1">On Leave</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5 text-center">
              <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center mx-auto mb-2">
                <UserPlus className="h-5 w-5 text-cyan-600" />
              </div>
              <p className="text-2xl font-bold text-cyan-600">{hrStats.recent_hires}</p>
              <p className="text-xs text-gray-500 mt-1">New (30 days)</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Rate + Department Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Attendance Rate Gauge */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Attendance Rate</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4">
                <div className="relative h-36 w-36">
                  <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke={attendanceRate >= 75 ? "#10b981" : attendanceRate >= 50 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${attendanceRate * 3.14} 314`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{attendanceRate}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  {hrStats.present_today} of {hrStats.total_employees} employees present
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Department Breakdown */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Department Breakdown</h2>
                </div>
              </CardHeader>
              <CardContent>
                {hrStats.department_breakdown.length === 0 ? (
                  <p className="text-gray-400 text-sm py-4">No department data available</p>
                ) : (
                  <div className="space-y-3">
                    {hrStats.department_breakdown.map((dept, i) => {
                      const rate = dept.total > 0 ? Math.round((dept.present / dept.total) * 100) : 0;
                      const absent = dept.total - dept.present;
                      return (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-28 text-sm font-medium text-gray-700 truncate shrink-0">
                            {dept.department}
                          </div>
                          <div className="flex-1">
                            <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
                              <div
                                className="h-full bg-emerald-500 rounded-l-full transition-all duration-500 flex items-center justify-center"
                                style={{ width: `${rate}%`, minWidth: rate > 0 ? "24px" : "0" }}
                              >
                                {rate > 15 && (
                                  <span className="text-[10px] font-semibold text-white">{dept.present}</span>
                                )}
                              </div>
                              {absent > 0 && (
                                <div
                                  className="h-full bg-red-400 flex items-center justify-center"
                                  style={{ width: `${100 - rate}%`, minWidth: "24px" }}
                                >
                                  <span className="text-[10px] font-semibold text-white">{absent}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-16 text-right text-sm text-gray-500 shrink-0">
                            {dept.present}/{dept.total}
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Present
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-400" /> Absent
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Summary Row */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Summary</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-emerald-600">{hrStats.present_today}</p>
                <p className="text-xs text-gray-500 mt-1">Checked In</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">{hrStats.incomplete_today}</p>
                <p className="text-xs text-gray-500 mt-1">Not Checked Out</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-600">{hrStats.absent_today}</p>
                <p className="text-xs text-gray-500 mt-1">No Show</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{hrStats.on_leave_today}</p>
                <p className="text-xs text-gray-500 mt-1">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==================== PERSONAL DASHBOARD VIEW ====================
  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Welcome, ${dashboard?.emp_name || "User"}`}
        subtitle="Here's your overview for today"
        actions={
          user?.hr_admin && hrStats ? (
            <button
              onClick={() => setHrView(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors text-sm font-medium"
            >
              <ToggleLeft className="h-5 w-5" />
              Switch to HR View
            </button>
          ) : undefined
        }
      />

      {/* Employee Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Employee</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{dashboard?.emp_name}</p>
              <p className="text-xs text-gray-400">ID: {dashboard?.card_no}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{dashboard?.department || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Designation</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{dashboard?.designation || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Joined</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(dashboard?.date_of_join || "")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TreePalm className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Leave Balance</h2>
              </div>
            </CardHeader>
            <CardContent>
              {leaveBalances.length === 0 ? (
                <p className="text-gray-400 text-sm py-4">No leave balance data available</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {leaveBalances.map((lb, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-2xl font-bold text-indigo-600">{lb.balance}</p>
                      <p className="text-xs text-gray-500 mt-1">{lb.leave_desc || `Type ${lb.leave_type}`}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Balance Chart</h2>
            </div>
          </CardHeader>
          <CardContent>
            <LeaveBalanceChart balances={leaveBalances} />
          </CardContent>
        </Card>
      </div>

      {/* Attendance Summary */}
      {attendanceSummary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Attendance This Month</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{attendanceSummary.present}</p>
                    <p className="text-xs text-gray-500 mt-1">Present</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{attendanceSummary.absent_days}</p>
                    <p className="text-xs text-gray-500 mt-1">Absent</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-amber-600">{Math.round(attendanceSummary.late_minutes / 60)}h</p>
                    <p className="text-xs text-gray-500 mt-1">Late Hours</p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-indigo-600">{attendanceSummary.total_days}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Attendance Chart</h2>
              </div>
            </CardHeader>
            <CardContent>
              <AttendanceChart summary={attendanceSummary} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
