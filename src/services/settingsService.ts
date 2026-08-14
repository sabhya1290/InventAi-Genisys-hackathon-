import api from './api';

export interface StoreSettings {
  _id?: string;
  name: string;
  currency: string;
  address: string;
  gst: string;
}

export const settingsService = {
  async get(): Promise<StoreSettings> {
    const res = await api.get<StoreSettings>('/settings');
    return res.data;
  },

  async update(data: Partial<StoreSettings>): Promise<StoreSettings> {
    const res = await api.put<StoreSettings>('/settings', data);
    return res.data;
  },
};
