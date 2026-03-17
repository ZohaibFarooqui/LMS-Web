"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHRMSController } from "@/controllers/useHRMSController";
import { HRMSEmployeeCreate } from "@/models/hrms";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import {
  Users,
  Search,
  UserPlus,
  Edit3,
  ArrowLeft,
  Save,
  X,
} from "lucide-react";

type View = "search" | "register" | "edit";

const EMPTY_FORM: HRMSEmployeeCreate = {
  name: "",
  fhname: "",
  atdtcard: "",
  sex: "",
  dtofbrth: "",
  nicno: "",
  dtofappt: "",
  dept_no: "",
  desg_cd: "",
  mobile: "",
  email: "",
  address: "",
  unit_id: 1,
  status: "A",
  user_paswd: "",
  hr_admin: "N",
  rpt_officer: "",
  marstat: "",
  grade_cd: "",
  religion: "",
  basic: undefined,
  gross: undefined,
  shift: "",
  w_hour: undefined,
};

const sexOptions = [
  { value: "", label: "Select" },
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
];

const statusOptions = [
  { value: "A", label: "Active" },
  { value: "I", label: "Inactive" },
  { value: "L", label: "Left" },
];

const hrAdminOptions = [
  { value: "N", label: "No" },
  { value: "Y", label: "Yes" },
];

const marstatOptions = [
  { value: "", label: "Select" },
  { value: "S", label: "Single" },
  { value: "M", label: "Married" },
  { value: "W", label: "Widowed" },
  { value: "D", label: "Divorced" },
];

export default function HRMSPage() {
  const { user } = useAuth();
  const {
    employees,
    selectedEmployee,
    loading,
    saving,
    error,
    success,
    search,
    loadEmployee,
    registerEmployee,
    editEmployee,
    clearSelection,
    clearMessages,
  } = useHRMSController();

  const [view, setView] = useState<View>("search");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<HRMSEmployeeCreate>({ ...EMPTY_FORM });

  // Access check
  if (!user?.hr_admin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 mt-2">
            You don&apos;t have HR admin privileges.
          </p>
        </div>
      </div>
    );
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    search(query);
  }

  function startRegister() {
    setForm({ ...EMPTY_FORM });
    clearMessages();
    setView("register");
  }

  function startEdit(empcode: string) {
    clearMessages();
    loadEmployee(empcode).then(() => setView("edit"));
  }

  function backToSearch() {
    clearSelection();
    clearMessages();
    setView("search");
  }

  // Populate form when selectedEmployee loads for edit
  if (view === "edit" && selectedEmployee && form.name === "" && selectedEmployee.name) {
    setForm({
      name: selectedEmployee.name || "",
      fhname: selectedEmployee.fhname || "",
      atdtcard: selectedEmployee.atdtcard || "",
      sex: selectedEmployee.sex || "",
      dtofbrth: selectedEmployee.dtofbrth || "",
      nicno: selectedEmployee.nicno || "",
      dtofappt: selectedEmployee.dtofappt || "",
      dept_no: selectedEmployee.dept_no || "",
      desg_cd: selectedEmployee.desg_cd || "",
      mobile: selectedEmployee.mobile || "",
      email: selectedEmployee.email || "",
      address: selectedEmployee.address || "",
      unit_id: selectedEmployee.unit_id ?? 1,
      status: selectedEmployee.status || "A",
      user_paswd: selectedEmployee.user_paswd || "",
      hr_admin: selectedEmployee.hr_admin || "N",
      rpt_officer: selectedEmployee.rpt_officer || "",
      marstat: selectedEmployee.marstat || "",
      grade_cd: selectedEmployee.grade_cd || "",
      religion: selectedEmployee.religion || "",
      basic: selectedEmployee.basic ?? undefined,
      gross: selectedEmployee.gross ?? undefined,
      shift: selectedEmployee.shift || "",
      w_hour: selectedEmployee.w_hour ?? undefined,
    });
  }

  function updateField(field: keyof HRMSEmployeeCreate, value: string | number | undefined) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmitRegister(e: FormEvent) {
    e.preventDefault();
    clearMessages();
    if (!form.name.trim()) return;
    const res = await registerEmployee(form);
    if (res && res.status === "success") {
      setForm({ ...EMPTY_FORM });
    }
  }

  async function onSubmitEdit(e: FormEvent) {
    e.preventDefault();
    clearMessages();
    if (!selectedEmployee) return;
    await editEmployee(selectedEmployee.empcode, form);
  }

  // =============== SEARCH VIEW ===============
  if (view === "search") {
    return (
      <div className="animate-fade-in">
        <PageHeader
          title="HRMS - Employee Management"
          subtitle="Register, search, and manage employees"
          actions={
            <Button onClick={startRegister}>
              <UserPlus className="h-4 w-4 mr-1.5" />
              Register Employee
            </Button>
          }
        />

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <form onSubmit={onSearch} className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, employee code, card number, or mobile..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit" loading={loading}>
                <Search className="h-4 w-4 mr-1.5" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={clearMessages} />
          </div>
        )}

        {/* Results Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Employee Directory
              </h2>
              {employees.length > 0 && (
                <span className="text-sm text-gray-400">
                  ({employees.length} results)
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <Spinner />
            ) : employees.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Search for employees to see results</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Employee
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Code
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Card#
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Dept
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Mobile
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Status
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {employees.map((emp, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                              {emp.name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {emp.name}
                              </p>
                              {emp.email && (
                                <p className="text-xs text-gray-400">
                                  {emp.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {emp.empcode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {emp.atdtcard || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {emp.dept_no || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {emp.mobile || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              emp.status === "A"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {emp.status === "A" ? "Active" : emp.status || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => startEdit(emp.empcode)}
                          >
                            <Edit3 className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
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

  // =============== REGISTER / EDIT FORM VIEW ===============
  const isEdit = view === "edit";
  const title = isEdit
    ? `Edit Employee — ${selectedEmployee?.empcode}`
    : "Register New Employee";
  const subtitle = isEdit
    ? "Modify employee details"
    : "Fill in the details to register a new employee";

  if (isEdit && loading) return <Spinner />;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Button variant="secondary" onClick={backToSearch}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Search
          </Button>
        }
      />

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={clearMessages} />
        </div>
      )}
      {success && (
        <div className="mb-4">
          <Alert type="success" message={success} onClose={clearMessages} />
        </div>
      )}

      <form onSubmit={isEdit ? onSubmitEdit : onSubmitRegister}>
        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Full Name *"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Employee full name"
                required
              />
              <Input
                label="Father / Husband Name"
                value={form.fhname || ""}
                onChange={(e) => updateField("fhname", e.target.value)}
                placeholder="Father or husband name"
              />
              <Select
                label="Gender"
                options={sexOptions}
                value={form.sex || ""}
                onChange={(e) => updateField("sex", e.target.value)}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={form.dtofbrth || ""}
                onChange={(e) => updateField("dtofbrth", e.target.value)}
              />
              <Input
                label="NIC Number"
                value={form.nicno || ""}
                onChange={(e) => updateField("nicno", e.target.value)}
                placeholder="XXXXX-XXXXXXX-X"
              />
              <Select
                label="Marital Status"
                options={marstatOptions}
                value={form.marstat || ""}
                onChange={(e) => updateField("marstat", e.target.value)}
              />
              <Input
                label="Religion"
                value={form.religion || ""}
                onChange={(e) => updateField("religion", e.target.value)}
              />
              <Input
                label="Mobile Number"
                value={form.mobile || ""}
                onChange={(e) => updateField("mobile", e.target.value)}
                placeholder="03001234567"
              />
              <Input
                label="Email Address"
                type="email"
                value={form.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="email@example.com"
              />
              <div className="sm:col-span-2 lg:col-span-3">
                <Input
                  label="Address"
                  value={form.address || ""}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Full address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Employment Information
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Attendance Card #"
                value={form.atdtcard || ""}
                onChange={(e) => updateField("atdtcard", e.target.value)}
                placeholder="Card number"
              />
              <Input
                label="Date of Appointment"
                type="date"
                value={form.dtofappt || ""}
                onChange={(e) => updateField("dtofappt", e.target.value)}
              />
              <Input
                label="Department Code"
                value={form.dept_no || ""}
                onChange={(e) => updateField("dept_no", e.target.value)}
                placeholder="e.g. 001"
              />
              <Input
                label="Designation Code"
                value={form.desg_cd || ""}
                onChange={(e) => updateField("desg_cd", e.target.value)}
                placeholder="e.g. MGR"
              />
              <Input
                label="Grade Code"
                value={form.grade_cd || ""}
                onChange={(e) => updateField("grade_cd", e.target.value)}
              />
              <Input
                label="Reporting Officer"
                value={form.rpt_officer || ""}
                onChange={(e) => updateField("rpt_officer", e.target.value)}
                placeholder="Reporting officer empcode"
              />
              <Select
                label="Status"
                options={statusOptions}
                value={form.status || "A"}
                onChange={(e) => updateField("status", e.target.value)}
              />
              <Input
                label="Company Code (Unit ID)"
                type="number"
                value={form.unit_id?.toString() || "1"}
                onChange={(e) =>
                  updateField("unit_id", parseInt(e.target.value) || 1)
                }
                min={1}
              />
              <Input
                label="Shift"
                value={form.shift || ""}
                onChange={(e) => updateField("shift", e.target.value)}
                placeholder="e.g. G"
              />
              <Input
                label="Working Hours"
                type="number"
                value={form.w_hour?.toString() || ""}
                onChange={(e) =>
                  updateField(
                    "w_hour",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Salary & Admin */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Salary & Access
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Basic Salary"
                type="number"
                value={form.basic?.toString() || ""}
                onChange={(e) =>
                  updateField(
                    "basic",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
              <Input
                label="Gross Salary"
                type="number"
                value={form.gross?.toString() || ""}
                onChange={(e) =>
                  updateField(
                    "gross",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
              <Select
                label="HR Admin"
                options={hrAdminOptions}
                value={form.hr_admin || "N"}
                onChange={(e) => updateField("hr_admin", e.target.value)}
              />
              <Input
                label="Initial Password"
                value={form.user_paswd || ""}
                onChange={(e) => updateField("user_paswd", e.target.value)}
                placeholder="Set employee password"
              />
              <Input
                label="HOD 1 (Employee PK)"
                type="number"
                value={form.hod1?.toString() || ""}
                onChange={(e) =>
                  updateField(
                    "hod1",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
              <Input
                label="HOD 2 (Employee PK)"
                type="number"
                value={form.hod2?.toString() || ""}
                onChange={(e) =>
                  updateField(
                    "hod2",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mb-8">
          <Button type="button" variant="secondary" onClick={backToSearch}>
            <X className="h-4 w-4 mr-1.5" />
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4 mr-1.5" />
            {isEdit ? "Update Employee" : "Register Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
}
