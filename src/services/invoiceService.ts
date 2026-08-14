import api from './api';

export interface Invoice {
  _id: string;
  orderId: { _id: string; status: string; total_amount: number; order_date: string } | string;
  invoice_date: string;
  total_amount: number;
  payment_status: 'Unpaid' | 'Paid' | 'Partially Paid';
  payment_method: string;
  createdAt: string;
}

export const invoiceService = {
  async getAll(): Promise<Invoice[]> {
    const res = await api.get<Invoice[]>('/invoices');
    return res.data;
  },

  async generate(orderId: string, payment_method?: string): Promise<Invoice> {
    const res = await api.post<Invoice>('/invoices', { orderId, payment_method });
    return res.data;
  },

  async update(id: string, data: Partial<Invoice>): Promise<Invoice> {
    const res = await api.put<Invoice>(`/invoices/${id}`, data);
    return res.data;
  },

  async markPaid(id: string): Promise<Invoice> {
    const res = await api.put<Invoice>(`/invoices/${id}`, { payment_status: 'Paid' });
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/invoices/${id}`);
  },
};
