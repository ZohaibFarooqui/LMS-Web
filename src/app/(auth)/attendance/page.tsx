"use client";

import { useAttendanceController } from "@/controllers/useAttendanceController";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import { Clock, Search, RefreshCw, Timer, AlertTriangle } from "lucide-react";

export default function AttendancePage() {
  const { records, summary, loading, dateRange, setDateRange, refresh } =
    useAttendanceController();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Attendance"
        subtitle="View your attendance records"
        actions={
          <Button variant="secondary" size="sm" onClick={refresh}>
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
        }
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-xl font-bold text-gray-900">{summary.total_days}</p>
              <p className="text-xs text-gray-500 mt-1">Total Days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-xl font-bold text-emerald-600">{summary.present}</p>
              <p className="text-xs text-gray-500 mt-1">Present</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-xl font-bold text-red-600">{summary.absent_days}</p>
              <p className="text-xs text-gray-500 mt-1">Absent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-xl font-bold text-amber-600">{summary.incomplete}</p>
              <p className="text-xs text-gray-500 mt-1">Incomplete</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-xl font-bold text-orange-600">{Math.round(summary.late_minutes / 60)}h {summary.late_minutes % 60}m</p>
              <p className="text-xs text-gray-500 mt-1">Late</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-xl font-bold text-indigo-600">{Math.round(summary.overtime_minutes / 60)}h {summary.overtime_minutes % 60}m</p>
              <p className="text-xs text-gray-500 mt-1">Overtime</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Date Range Filter */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Input
                label="From Date"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                label="To Date"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
            <Button onClick={refresh} className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-1.5" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Attendance Records</h2>
            <span className="text-sm text-gray-400">({records.length})</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <Spinner />
          ) : records.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No attendance records found for selected period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Day</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">In Time</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Out Time</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Working Hrs</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Late</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {records.map((record, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatDate(record.roster_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.day_name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Timer className="h-3.5 w-3.5 text-emerald-500" />
                          {record.in_time || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Timer className="h-3.5 w-3.5 text-red-400" />
                          {record.out_time || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {record.w_hrs ?? 0}h {record.w_mnt ?? 0}m
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {((record.late_hrs ?? 0) > 0 || (record.late_mnt ?? 0) > 0) ? (
                          <span className="flex items-center gap-1 text-amber-600">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {record.late_hrs ?? 0}h {record.late_mnt ?? 0}m
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={record.status || "-"} />
                      </td>
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
