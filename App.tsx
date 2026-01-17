
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LayoutDashboard, 
  History, 
  PieChart as PieChartIcon, 
  Settings, 
  Sparkles,
  Search,
  LogOut,
  Bell,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  User,
  CreditCard
} from 'lucide-react';
import { AppState, Transaction, TransactionType, Category } from './types';
import { DEFAULT_CATEGORIES } from './constants';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import { getFinancialAdvice } from './services/geminiService';
import HistoryView from './views/HistoryView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('balansim_v2_state');
    if (saved) return JSON.parse(saved);
    
    return {
      startingBalance: 10000, // Updated default for demo
      transactions: [
        {
          id: 'init-1',
          type: TransactionType.EXPENSE,
          categoryId: 'cat-1',
          amount: 1500,
          note: 'Restoranda tushlik',
          date: new Date().toISOString()
        }
      ],
      categories: DEFAULT_CATEGORIES
    };
  });

  const [aiAdvice, setAiAdvice] = useState<string>('Ma\'lumotlar tahlil qilinmoqda...');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('balansim_v2_state', JSON.stringify(state));
  }, [state]);

  const totals = useMemo(() => {
    const expenses = state.transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    const income = state.transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // MATHEMATICAL ACCURACY: Initial + Income - Expenses
    const balance = state.startingBalance + income - expenses;
    
    return { expenses, income, balance, start: state.startingBalance };
  }, [state.transactions, state.startingBalance]);

  const updateAiAdvice = useCallback(async () => {
    const advice = await getFinancialAdvice(state.transactions, totals.balance);
    setAiAdvice(advice || 'Sizning moliyaviy holatingiz a\'lo darajada.');
  }, [state.transactions, totals.balance]);

  useEffect(() => {
    const timer = setTimeout(() => updateAiAdvice(), 1500);
    return () => clearTimeout(timer);
  }, [updateAiAdvice]);

  const handleAddTransaction = (data: { type: TransactionType; categoryId: string; amount: number; note: string }) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      date: new Date().toISOString()
    };
    setState(prev => ({ ...prev, transactions: [...prev.transactions, newTransaction] }));
  };

  const handleDeleteTransaction = (id: string) => {
    setState(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return <HistoryView transactions={state.transactions} categories={state.categories} onDelete={handleDeleteTransaction} />;
      case 'reports':
        return <ReportsView transactions={state.transactions} categories={state.categories} startingBalance={state.startingBalance} />;
      case 'settings':
        return <SettingsView state={state} setState={setState} />;
      default:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* AI Insight Premium Card */}
            <div className="relative p-1 bg-gradient-to-r from-[#4318FF] via-[#B233FF] to-[#4318FF] rounded-[32px] overflow-hidden group shadow-2xl shadow-indigo-100">
               <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[30px] flex flex-col md:flex-row items-center gap-6">
                <div className="shrink-0 p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Aqlli Insight</h4>
                  <p className="text-xl font-bold text-slate-800 leading-tight italic">"{aiAdvice}"</p>
                </div>
               </div>
            </div>

            <SummaryCards 
              income={totals.income} 
              expenses={totals.expenses} 
              balance={totals.balance} 
              startingBalance={state.startingBalance}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <Charts transactions={state.transactions} categories={state.categories} />
                <TransactionList transactions={state.transactions} categories={state.categories} />
              </div>
              <div className="space-y-8">
                <TransactionForm categories={state.categories} onAdd={handleAddTransaction} />
                
                {/* Visual Goal Tracker */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 relative group overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                    <PieChartIcon className="w-32 h-32" />
                   </div>
                   <h3 className="text-lg font-extrabold text-[#1B2559] mb-4">Moliyaviy O'sish</h3>
                   <div className="flex items-center justify-between mb-3">
                      <span className="text-4xl font-black text-[#4318FF]">{totals.income > 0 ? ((totals.income - totals.expenses) / totals.income * 100).toFixed(0) : 0}%</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sof foyda koeffitsienti</span>
                   </div>
                   <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#4318FF] to-[#3A24FF] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(67,24,255,0.4)]" 
                        style={{ width: `${Math.min(100, Math.max(0, totals.income > 0 ? ((totals.income - totals.expenses) / totals.income * 100) : 0))}%` }} 
                      />
                   </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] text-[#1B2559]">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-[#0B1437]/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 w-72 bg-white z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col shadow-2xl md:shadow-none`}>
        <div className="p-10 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4318FF] to-[#B233FF] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <Wallet className="w-7 h-7 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#1B2559]">BALANSIM</span>
          </div>

          <nav className="space-y-2">
            <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }} />
            <NavItem icon={<History />} label="Tarix" active={activeTab === 'history'} onClick={() => { setActiveTab('history'); setSidebarOpen(false); }} />
            <NavItem icon={<PieChartIcon />} label="Tahlil" active={activeTab === 'reports'} onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }} />
            <NavItem icon={<Settings />} label="Sozlamalar" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }} />
          </nav>

          <div className="mt-auto pt-10">
            <div className="bg-[#F4F7FE] p-6 rounded-3xl border border-slate-100 group hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Foydalanuvchi</span>
                  <span className="text-sm font-black text-[#1B2559] truncate max-w-[120px]">Erkinjon Orziqulov</span>
                </div>
              </div>
              <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors text-xs font-bold uppercase tracking-widest pt-3 border-t border-slate-200 w-full">
                <LogOut className="w-4 h-4" /> Chiqish
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col">
        <header className="px-6 md:px-12 py-8 flex items-center justify-between sticky top-0 z-30 bg-[#F4F7FE]/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 bg-white rounded-xl shadow-sm border border-slate-100">
              <Filter className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-[#707EAE] uppercase tracking-[0.1em]">
                {activeTab === 'dashboard' ? 'Umumiy holat' : activeTab === 'history' ? 'Tranzaksiyalar' : activeTab === 'reports' ? 'Analitika' : 'Profil Sozlamalari'}
              </h2>
              <h1 className="text-3xl font-black text-[#1B2559] tracking-tight">Xush kelibsiz, Erkinjon!</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#707EAE] group-focus-within:text-[#4318FF] transition-colors" />
              <input 
                type="text" 
                placeholder="Qidiruv..." 
                className="bg-white border border-slate-100 pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#4318FF]/20 transition-all w-64 shadow-sm"
              />
            </div>
            <button className="p-3 bg-white border border-slate-100 rounded-2xl text-[#707EAE] hover:text-[#4318FF] transition-all shadow-sm relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#4318FF] to-[#3A24FF] flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100 border-2 border-white">
              EO
            </div>
          </div>
        </header>

        <div className="flex-1 px-6 md:px-12 pb-12 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
      active 
      ? 'bg-white text-[#4318FF] shadow-xl shadow-slate-200/50 scale-[1.02]' 
      : 'text-[#707EAE] hover:bg-white/50 hover:text-[#1B2559]'
    }`}
  >
    <span className={active ? 'text-[#4318FF]' : 'text-[#707EAE] opacity-50'}>{React.cloneElement(icon, { className: 'w-6 h-6' })}</span>
    <span>{label}</span>
  </button>
);

export default App;
