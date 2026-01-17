
import React, { useMemo } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Target } from 'lucide-react';

interface ReportsViewProps {
  transactions: Transaction[];
  categories: Category[];
  startingBalance: number;
}

const ReportsView: React.FC<ReportsViewProps> = ({ transactions, categories, startingBalance }) => {
  const expenseTotal = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
  const incomeTotal = transactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
  const netSavings = incomeTotal - expenseTotal;

  const categoryShare = useMemo(() => {
    return categories.map(cat => {
      const val = transactions
        .filter(t => t.type === TransactionType.EXPENSE && t.categoryId === cat.id)
        .reduce((s, t) => s + t.amount, 0);
      return { name: cat.name, value: val, color: cat.color };
    }).filter(c => c.value > 0);
  }, [transactions, categories]);

  const balanceTrend = useMemo(() => {
    let current = startingBalance;
    const days = 14;
    const trend = [];
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => t.date.startsWith(ds));
      dayTransactions.forEach(t => {
        if (t.type === TransactionType.INCOME) current += t.amount;
        else current -= t.amount;
      });

      trend.push({
        name: d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }),
        balance: current
      });
    }
    return trend;
  }, [transactions, startingBalance]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Sof Jamg'arma" value={netSavings} trend={netSavings >= 0 ? 'up' : 'down'} icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Xarajat Ulushi" value={incomeTotal > 0 ? (expenseTotal / incomeTotal * 100) : 0} isPercent icon={<ArrowDownRight className="w-5 h-5" />} color="rose" />
        <StatCard title="O'rtacha Kunlik" value={expenseTotal / 30} icon={<ArrowUpRight className="w-5 h-5" />} color="indigo" />
        <StatCard title="Kutilayotgan Balans" value={startingBalance + netSavings} icon={<Target className="w-5 h-5" />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Balans Dinamikasi</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-slate-400 uppercase">So'nggi 15 kun</span>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceTrend}>
                <defs>
                  <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(v: any) => [`${v.toLocaleString()} so'm`, 'Balans']}
                />
                <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorBal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Kategoriyalar</h3>
          <div className="h-[300px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {categoryShare.map(c => (
              <div key={c.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{c.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{((c.value / expenseTotal) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, isPercent, icon, color = 'indigo' }: any) => {
  const colorMap: any = {
    indigo: 'bg-indigo-50 text-indigo-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
      <div className={`p-3 rounded-2xl w-fit mb-4 ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <h4 className="text-xl font-black text-slate-900">{isPercent ? value.toFixed(1) : value.toLocaleString()}</h4>
        <span className="text-xs font-bold text-slate-400">{isPercent ? '%' : 'so‘m'}</span>
      </div>
    </div>
  );
};

export default ReportsView;
