export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  user_id: number;
  user_name: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  job_title: string;
  job_company: string;
  job_location: string;
  user_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface JobRequest {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  type: string;
}

export interface ApplicationRequest {
  job_id: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
