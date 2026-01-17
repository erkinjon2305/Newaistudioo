
import React from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { getCategoryIcon } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories }) => {
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50">
        <h3 className="text-lg font-semibold text-slate-800">So‘nggi Amaliyotlar</h3>
      </div>
      <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Hozircha amaliyotlar yo'q
          </div>
        ) : (
          sorted.map((t) => {
            const cat = categories.find(c => c.id === t.categoryId);
            const isIncome = t.type === TransactionType.INCOME;
            return (
              <div key={t.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: cat?.color || '#64748b' }}
                  >
                    {cat ? getCategoryIcon(cat.icon) : null}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{cat?.name || 'Noma‘lum'}</h4>
                    <p className="text-xs text-slate-400">{t.note || 'Izohsiz'} • {new Date(t.date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className={`font-bold ${isIncome ? 'text-emerald-500' : 'text-slate-800'}`}>
                  {isIncome ? '+' : '-'}{t.amount.toLocaleString('uz-UZ')} so‘m
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionList;
