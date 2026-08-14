import api from './api';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  customerId: { _id: string; name: string; email: string; phone: string } | string;
  order_date: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  total_amount: number;
  items: OrderItem[];
  createdAt: string;
}

export type CreateOrderDto = {
  customerId: string;
  status?: Order['status'];
  total_amount: number;
  items: OrderItem[];
};

export const orderService = {
  async getAll(): Promise<Order[]> {
    const res = await api.get<Order[]>('/orders');
    return res.data;
  },

  async create(data: CreateOrderDto): Promise<Order> {
    const res = await api.post<Order>('/orders', data);
    return res.data;
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    const res = await api.put<Order>(`/orders/${id}`, { status });
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/orders/${id}`);
  },
};
