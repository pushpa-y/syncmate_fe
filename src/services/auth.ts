import { api } from "./api";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  name: string;
}

export const registerUser = (data: RegisterData) =>
  api.post("/auth/register", data);
export const loginUser = (data: LoginData) => api.post("/auth/login", data);
export const updateProfile = (data: UpdateProfileData) =>
  api.put("/auth/update-profile", data);
export const resetPassword = (data: { newPassword: string }) =>
  api.put("/auth/reset-password", data);
