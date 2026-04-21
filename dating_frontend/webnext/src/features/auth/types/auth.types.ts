export interface User {
  id: number;
  full_name: string;
  email: string;
  username: string; // ✅ add this
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: Tokens;
  };
}

export interface LoginPayload {
  email: string; // email or phone
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  username: string;   // ✅ add this
  email: string;
  password: string;
  confirm_password: string;
}

export interface ApiError {
  message?: string;
  error?: string;
  detail?: string;
}


export interface LoginResponse {
  data: {
    user: User;
    tokens: Tokens;
  };
  message: string;
}