import api from './api';

export interface Notification {
  _id: string;
  type: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const res = await api.get<Notification[]>('/notifications');
    return res.data;
  },

  async markRead(id: string): Promise<Notification> {
    const res = await api.put<Notification>(`/notifications/${id}/mark-read`);
    return res.data;
  },

  async markAllRead(): Promise<void> {
    await api.put('/notifications/mark-all-read');
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },
};
