import api from './api';

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: string;
}

export type CreateCustomerDto = Omit<Customer, '_id' | 'createdAt'>;

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const res = await api.get<Customer[]>('/customers');
    return res.data;
  },

  async create(data: CreateCustomerDto): Promise<Customer> {
    const res = await api.post<Customer>('/customers', data);
    return res.data;
  },

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    const res = await api.put<Customer>(`/customers/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};
