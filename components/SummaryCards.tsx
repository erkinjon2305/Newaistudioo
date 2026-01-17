
import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet, Info } from 'lucide-react';

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
  startingBalance: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ income, expenses, balance, startingBalance }) => {
  const formatValue = (val: number) => {
    const isNegative = val < 0;
    const absVal = Math.abs(val);
    return (isNegative ? '-' : '') + absVal.toLocaleString('uz-UZ');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Income Card - Luxury Green */}
      <div className="bg-white p-8 rounded-[36px] shadow-xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden group transition-all hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full -mr-12 -mt-12 blur-3xl group-hover:scale-125 transition-transform" />
        <div className="relative">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-[18px] w-fit mb-8 shadow-sm">
            <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
          </div>
          <p className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1">Daromadlar</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-[#1B2559] tracking-tight">{formatValue(income)}</h3>
            <span className="text-sm font-bold text-[#A3AED0]">so‘m</span>
          </div>
        </div>
      </div>

      {/* Expense Card - Luxury Rose */}
      <div className="bg-white p-8 rounded-[36px] shadow-xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden group transition-all hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/30 rounded-full -mr-12 -mt-12 blur-3xl group-hover:scale-125 transition-transform" />
        <div className="relative">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-[18px] w-fit mb-8 shadow-sm">
            <ArrowDownLeft className="w-6 h-6 stroke-[2.5]" />
          </div>
          <p className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1">Xarajatlar</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-[#1B2559] tracking-tight">{formatValue(expenses)}</h3>
            <span className="text-sm font-bold text-[#A3AED0]">so‘m</span>
          </div>
        </div>
      </div>

      {/* Balance Card - The Premium One */}
      <div className="bg-[#11047A] p-8 rounded-[36px] shadow-2xl shadow-indigo-200 relative overflow-hidden group transition-all hover:-translate-y-1">
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4318FF]/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className="p-3.5 bg-white/10 backdrop-blur-md text-white rounded-[18px] w-fit shadow-sm">
              <Wallet className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="group/info relative">
              <Info className="w-4 h-4 text-white/30 cursor-help hover:text-white transition-colors" />
              <div className="absolute bottom-full right-0 mb-3 w-56 p-4 bg-white rounded-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-20 shadow-2xl text-[11px] leading-relaxed border border-slate-100">
                <p className="font-black text-[#1B2559] uppercase tracking-widest mb-2 pb-2 border-b">Hisoblash tartibi:</p>
                <div className="space-y-1 font-bold text-slate-500">
                  <div className="flex justify-between"><span>Boshlang'ich:</span> <span className="text-slate-800">{startingBalance.toLocaleString()}</span></div>
                  <div className="flex justify-between text-emerald-600"><span>Kirim (+):</span> <span>{income.toLocaleString()}</span></div>
                  <div className="flex justify-between text-rose-500"><span>Chiqim (-):</span> <span>{expenses.toLocaleString()}</span></div>
                  <div className="pt-2 flex justify-between text-[#1B2559] font-black border-t mt-1"><span>Jami:</span> <span>{balance.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Sof Balans</p>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-3xl font-black tracking-tight ${balance < 0 ? 'text-rose-400' : 'text-white'}`}>
              {formatValue(balance)}
            </h3>
            <span className="text-sm font-bold text-white/40">so‘m</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
