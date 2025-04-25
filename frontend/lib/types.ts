export interface User {
  id: string;
  email: string;
  role: "user" | "recruiter" | "admin";
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: "user" | "recruiter" | "admin";
  companyName?: string;
}
