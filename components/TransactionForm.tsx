
import React, { useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { TransactionType, Category } from '../types';

interface TransactionFormProps {
  categories: Category[];
  onAdd: (data: { type: TransactionType; categoryId: string; amount: number; note: string }) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ categories, onAdd }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onAdd({
      type,
      categoryId,
      amount: parseFloat(amount),
      note
    });

    setAmount('');
    setNote('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden">
      <h3 className="text-xl font-black text-slate-900 mb-6">Yangi Amaliyot</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
          <button
            type="button"
            onClick={() => setType(TransactionType.EXPENSE)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs transition-all ${
              type === TransactionType.EXPENSE 
              ? 'bg-white text-rose-600 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Minus className="w-4 h-4" /> Chiqim
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.INCOME)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs transition-all ${
              type === TransactionType.INCOME 
              ? 'bg-white text-emerald-600 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Plus className="w-4 h-4" /> Kirim
          </button>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bo‘lim</label>
          <select 
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Summa (so‘m)</label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Masalan: 50,000"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Izoh</label>
          <input 
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Qisqa izoh kiriting..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <button 
          type="submit"
          className={`w-full font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 ${
            isSuccess 
            ? 'bg-emerald-500 text-white shadow-emerald-100' 
            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
          }`}
        >
          {isSuccess ? <><Check className="w-5 h-5" /> Qo'shildi!</> : 'Qo‘shish'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
