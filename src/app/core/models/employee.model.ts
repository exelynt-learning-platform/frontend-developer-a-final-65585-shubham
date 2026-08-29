export interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
}

export type EmployeeFormData = Omit<Employee, 'id'>;