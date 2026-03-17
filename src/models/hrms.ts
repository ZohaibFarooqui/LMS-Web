export interface HRMSEmployee {
  empcode: string;
  name?: string;
  fhname?: string;
  atdtcard?: string;
  sex?: string;
  dtofbrth?: string;
  nicno?: string;
  dtofappt?: string;
  dept_no?: string;
  desg_cd?: string;
  mobile?: string;
  email?: string;
  address?: string;
  unit_id?: number;
  status?: string;
  hr_admin?: string;
  rpt_officer?: string;
  marstat?: string;
  grade_cd?: string;
  religion?: string;
  hod1?: number;
  hod2?: number;
  hod3?: number;
  basic?: number;
  gross?: number;
  shift?: string;
  w_hour?: number;
  user_paswd?: string;
}

export interface HRMSEmployeeCreate {
  name: string;
  fhname?: string;
  atdtcard?: string;
  sex?: string;
  dtofbrth?: string;
  nicno?: string;
  dtofappt?: string;
  dept_no?: string;
  desg_cd?: string;
  mobile?: string;
  email?: string;
  address?: string;
  unit_id?: number;
  status?: string;
  user_paswd?: string;
  hr_admin?: string;
  rpt_officer?: string;
  marstat?: string;
  grade_cd?: string;
  religion?: string;
  hod1?: number;
  hod2?: number;
  hod3?: number;
  basic?: number;
  gross?: number;
  shift?: string;
  w_hour?: number;
}

export interface HRDashboardStats {
  total_employees: number;
  present_today: number;
  absent_today: number;
  late_today: number;
  incomplete_today: number;
  on_leave_today: number;
  recent_hires: number;
  department_breakdown: DepartmentStat[];
}

export interface DepartmentStat {
  department: string;
  total: number;
  present: number;
}

export interface HRMSSearchResult {
  empcode: string;
  name?: string;
  fhname?: string;
  atdtcard?: string;
  dept_no?: string;
  desg_cd?: string;
  mobile?: string;
  email?: string;
  status?: string;
  hr_admin?: string;
  unit_id?: number;
}
