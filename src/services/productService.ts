import api from './api';

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  purchase_price: number;
  selling_price: number;
  stock_quantity: number;
  reorder_threshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdAt: string;
}

export type CreateProductDto = Omit<Product, '_id' | 'status' | 'createdAt'>;

export const productService = {
  async getAll(): Promise<Product[]> {
    const res = await api.get<Product[]>('/products');
    return res.data;
  },

  async create(data: CreateProductDto): Promise<Product> {
    const res = await api.post<Product>('/products', data);
    return res.data;
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const res = await api.put<Product>(`/products/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
