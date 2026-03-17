"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  searchHRMSEmployees,
  getHRMSEmployee,
  createHRMSEmployee,
  updateHRMSEmployee,
} from "@/services/hrmsService";
import { HRMSEmployee, HRMSEmployeeCreate, HRMSSearchResult } from "@/models/hrms";

export function useHRMSController() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<HRMSSearchResult[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<HRMSEmployee | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function search(query: string) {
    if (!user || !query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await searchHRMSEmployees(query, user.card_no);
      setEmployees(res.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function loadEmployee(empcode: string) {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const emp = await getHRMSEmployee(empcode, user.card_no);
      setSelectedEmployee(emp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employee");
    } finally {
      setLoading(false);
    }
  }

  async function registerEmployee(data: HRMSEmployeeCreate) {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await createHRMSEmployee(data, user.card_no);
      setSuccess(res.message || "Employee registered successfully");
      return res;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function editEmployee(empcode: string, data: Partial<HRMSEmployeeCreate>) {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await updateHRMSEmployee(empcode, data, user.card_no);
      setSuccess(res.message || "Employee updated successfully");
      return res;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      return null;
    } finally {
      setSaving(false);
    }
  }

  function clearSelection() {
    setSelectedEmployee(null);
  }

  function clearMessages() {
    setError(null);
    setSuccess(null);
  }

  return {
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
  };
}
