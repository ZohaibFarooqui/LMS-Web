import { apiRequest } from "./api";
import { HRMSEmployee, HRMSEmployeeCreate, HRMSSearchResult, HRDashboardStats } from "@/models/hrms";

export async function searchHRMSEmployees(
  query: string,
  adminCardNo: string
): Promise<{ items: HRMSSearchResult[] }> {
  return apiRequest(
    `/hrms/employees/search?q=${encodeURIComponent(query)}&admin_card_no=${adminCardNo}`
  );
}

export async function getHRMSEmployee(
  empcode: string,
  adminCardNo: string
): Promise<HRMSEmployee> {
  return apiRequest<HRMSEmployee>(
    `/hrms/employees/${empcode}?admin_card_no=${adminCardNo}`
  );
}

export async function createHRMSEmployee(
  data: HRMSEmployeeCreate,
  adminCardNo: string
): Promise<{ status: string; message: string; empcode?: string }> {
  return apiRequest(`/hrms/employees?admin_card_no=${adminCardNo}`, {
    method: "POST",
    body: data,
  });
}

export async function updateHRMSEmployee(
  empcode: string,
  data: Partial<HRMSEmployeeCreate>,
  adminCardNo: string
): Promise<{ status: string; message: string }> {
  return apiRequest(`/hrms/employees/${empcode}?admin_card_no=${adminCardNo}`, {
    method: "PUT",
    body: data,
  });
}

export async function fetchHRDashboard(
  adminCardNo: string
): Promise<HRDashboardStats> {
  return apiRequest<HRDashboardStats>(
    `/hrms/dashboard?admin_card_no=${adminCardNo}`
  );
}
