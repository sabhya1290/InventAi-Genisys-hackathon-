import api from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },

  async signup(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    storeName: string;
  }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/signup', data);
    return res.data;
  },

  async getMe(): Promise<AuthUser> {
    const res = await api.get<AuthUser>('/auth/me');
    return res.data;
  },

  async updateMe(data: { name?: string; phone?: string }): Promise<AuthUser> {
    const res = await api.put<AuthUser>('/auth/me', data);
    return res.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/change-password', { currentPassword, newPassword });
  },

  logout(): void {
    localStorage.removeItem('inventai_token');
    localStorage.removeItem('inventai_user');
  },

  getStoredUser(): AuthUser | null {
    const u = localStorage.getItem('inventai_user');
    return u ? JSON.parse(u) : null;
  },

  storeSession(token: string, user: AuthUser): void {
    localStorage.setItem('inventai_token', token);
    localStorage.setItem('inventai_user', JSON.stringify(user));
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('inventai_token');
  },
};
