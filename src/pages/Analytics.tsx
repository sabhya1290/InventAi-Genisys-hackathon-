import React, { useState } from 'react';
import { useAppStore } from '../store/MockAppStore';
import { 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { TrendingUp, AlertTriangle, ShieldAlert, BadgeIndianRupee } from 'lucide-react';

const COLORS = ['#162a5c', '#d4af37', '#10b981', '#ef4444', '#f59e0b', '#64748b'];

type AnalyticsTab = 'overview' | 'inventory' | 'financials';

export const Analytics: React.FC = () => {
  const { orders, products, invoices } = useAppStore();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');

  const formatINR = (amt: number) => `₹${amt.toLocaleString('en-IN')}`;

  // Metrics Logic
  const totalRevenue = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalCost = orders.reduce((acc, o) => {
    return acc + o.items.reduce((sum, item) => {
      const prod = products.find(p => p._id === item.productId);
      return sum + (prod ? (prod.purchase_price * item.quantity) : 0);
    }, 0);
  }, 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';

  const lowStockCount = products.filter(p => p.stock_quantity <= p.reorder_threshold).length;
  const unpaidInvoices = invoices.filter(i => i.payment_status === 'Unpaid').length;
  const unpaidTotal = invoices.filter(i => i.payment_status === 'Unpaid').reduce((acc, i) => acc + i.total_amount, 0);

  // Mock Trend Chart Data
  const revenueTrend = [
    { name: 'Oct', revenue: 6000, profit: 1800, cost: 4200 },
    { name: 'Nov', revenue: 5500, profit: 1500, cost: 4000 },
    { name: 'Dec', revenue: 8000, profit: 2400, cost: 5600 },
    { name: 'Jan', revenue: 10500, profit: 3200, cost: 7300 },
    { name: 'Feb', revenue: 12000, profit: 4100, cost: 7900 },
    { name: 'Mar', revenue: 14200, profit: 5800, cost: 8400 }, // Simulated upward trend
  ];

  const dailySales = [
    { name: 'Mon', sales: 12, value: 3400 }, { name: 'Tue', sales: 15, value: 4200 },
    { name: 'Wed', sales: 9, value: 2500 }, { name: 'Thu', sales: 22, value: 6800 },
    { name: 'Fri', sales: 30, value: 8900 }, { name: 'Sat', sales: 18, value: 5100 }, 
    { name: 'Sun', sales: 5, value: 1200 }
  ];

  // Product Distribution & Sales maps
  const productSalesMap: Record<string, number> = {};
  orders.forEach(o => o.items.forEach(i => {
    productSalesMap[i.productId] = (productSalesMap[i.productId] || 0) + i.quantity;
  }));
  
  const topSelling = Object.entries(productSalesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, qty]) => {
      const p = products.find(prod => prod._id === id);
      return { name: p ? p.name : 'Unknown', sales: qty };
    });

  const slowMoving = products
    .filter(p => !productSalesMap[p._id] || productSalesMap[p._id] < 5)
    .slice(0, 5)
    .map(p => ({ name: p.name, stock: p.stock_quantity }));

  const catMap: Record<string, number> = {};
  products.forEach(p => catMap[p.category] = (catMap[p.category] || 0) + 1);
  const categoryData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  const invoiceStatus = [
    { name: 'Paid', value: invoices.filter(i => i.payment_status === 'Paid').length },
    { name: 'Unpaid', value: invoices.filter(i => i.payment_status === 'Unpaid').length }
  ].filter(v => v.value > 0);

  return (
    <div className="page-container" style={{ padding: 0 }}>
      {/* Dynamic Header & Actionable Insights */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>Business Intelligence Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {totalProfit > 0 && (
            <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} /> Margins remain healthy at {profitMargin}%
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="badge badge-warning" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} /> {lowStockCount} Products are falling below reorder threshold!
            </div>
          )}
          {unpaidInvoices > 0 && (
            <div className="badge badge-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={16} /> {unpaidInvoices} Unpaid invoices pending ({formatINR(unpaidTotal)})
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>Total Revenue YTD</span>
            <span style={{ color: 'var(--color-success)' }}>↑ 22.5%</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '0.5rem' }}>{formatINR(totalRevenue)}</div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>Total Net Profit</span>
            <span style={{ color: 'var(--color-success)' }}>↑ 18.2%</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-success)', marginTop: '0.5rem' }}>{formatINR(totalProfit)}</div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>Total Unpaid Dues</span>
            <span style={{ color: 'var(--color-danger)' }}>{unpaidInvoices} invoices</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-danger)', marginTop: '0.5rem' }}>{formatINR(unpaidTotal)}</div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>Completed Orders</span>
            <span style={{ color: 'var(--color-primary)' }}>This Month</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-primary-light)', marginTop: '0.5rem' }}>{orders.length}</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
        {(['overview', 'inventory', 'financials'] as AnalyticsTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '1rem 2rem', border: 'none', background: 'transparent', cursor: 'pointer',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-light)',
              borderBottom: activeTab === tab ? '3px solid var(--color-primary)' : '3px solid transparent',
              textTransform: 'capitalize', fontSize: '1rem', transition: 'all 0.3s'
            }}
          >
            {tab === 'overview' ? 'Performance Overview' : tab === 'inventory' ? 'Inventory Dynamics' : 'Financial Health'}
          </button>
        ))}
      </div>

      {/* Switch Tab Content */}
      <div style={{ animation: 'slideUp 0.3s ease-out' }}>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ height: '400px', gridColumn: 'span 2' }}>
              <h3 style={{ marginBottom: '1rem' }}>Gross Revenue vs Effective Profit & Cost</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#162a5c" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#162a5c" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip formatter={(val: any) => `₹${val}`} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#162a5c" fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="cost" name="COGS (Cost of Goods)" stroke="#ef4444" fillOpacity={0} />
                  <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10b981" fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ height: '350px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Weekly Sales Volume</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="sales" name="Orders Count" fill="#162a5c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ height: '350px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Weekly Sales Value</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip formatter={(val: any) => `₹${val}`} />
                  <Bar dataKey="value" name="Gross Sales (₹)" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ height: '350px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Top 5 High-Velocity Products</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSelling} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="sales" name="Units Sold" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ height: '350px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Slow Moving / Stagnant Stock</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={slowMoving} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="stock" name="Remaining Units" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ height: '350px', gridColumn: 'span 2' }}>
              <h3 style={{ marginBottom: '1rem' }}>Catalog Category Split</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="value" label>
                    {categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ height: '400px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Outstanding Invoice Ratios</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={invoiceStatus} cx="50%" cy="50%" outerRadius={120} dataKey="value" label>
                    {invoiceStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.name === 'Paid' ? '#162a5c' : '#ef4444'} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom"/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Financial Quick Stats</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                    <BadgeIndianRupee color="#10b981" />
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>Gross Capital Flow</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>{formatINR(totalRevenue)}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                    <AlertTriangle color="#ef4444" />
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>Locked Capital (Unpaid)</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>{formatINR(unpaidTotal)}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                    <TrendingUp color="#d4af37" />
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>Operational Efficiency (Margin/Return)</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>{profitMargin}% Growth Marker</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
