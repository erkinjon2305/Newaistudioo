
import React, { useState, useMemo } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { getCategoryIcon } from '../constants';
import { Search, Trash2, Calendar, ArrowUpCircle, ArrowDownCircle, MoreHorizontal } from 'lucide-react';

interface HistoryViewProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ transactions, categories, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');

  const filtered = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'ALL' || t.type === filterType;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType, categories]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Qidirish (izoh yoki bo'lim)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {(['ALL', TransactionType.INCOME, TransactionType.EXPENSE] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === type 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {type === 'ALL' ? 'Hammasi' : type === TransactionType.INCOME ? 'Kirim' : 'Chiqim'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amaliyot</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Sana</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Summa</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Holat</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Boshqaruv</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((t) => {
                const cat = categories.find(c => c.id === t.categoryId);
                const isIncome = t.type === TransactionType.INCOME;
                return (
                  <tr key={t.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                          style={{ backgroundColor: cat?.color }}
                        >
                          {cat && getCategoryIcon(cat.icon)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{cat?.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{t.note || 'Izohsiz'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(t.date).toLocaleDateString('uz-UZ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-black ${isIncome ? 'text-emerald-500' : 'text-slate-900'}`}>
                        {isIncome ? '+' : '-'}{t.amount.toLocaleString()} so‘m
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {isIncome ? 'Muvaffaqiyatli' : 'Xarajat'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDelete(t.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-medium">
                    Ma'lumot topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
