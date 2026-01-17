
import React, { useState } from 'react';
import { AppState, Category } from '../types';
import { Save, Plus, Trash2, Palette, Shield, User, CreditCard, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ state, setState }) => {
  const [startBal, setStartBal] = useState(state.startingBalance.toString());
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#4318FF');
  const [isSaved, setIsSaved] = useState(false);

  const saveBalance = () => {
    setState(prev => ({ ...prev, startingBalance: parseFloat(startBal) || 0 }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const addCategory = () => {
    if (!newCatName) return;
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: newCatName,
      icon: 'Layers',
      color: newCatColor,
      isCustom: true
    };
    setState(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
    setNewCatName('');
  };

  const removeCategory = (id: string) => {
    setState(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id) }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Profile Section */}
      <section className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-50">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#4318FF] to-[#3A24FF] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-100 border-4 border-[#F4F7FE]">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#1B2559]">Shaxsiy Profil</h3>
            <p className="text-[#A3AED0] font-bold text-sm">Erkinjon Orziqulov — Platforma egasi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest ml-1">To'liq ism</label>
            <input 
              type="text" 
              defaultValue="Erkinjon Orziqulov" 
              className="w-full bg-[#F4F7FE] border-none rounded-2xl px-6 py-4 font-bold text-[#1B2559] outline-none cursor-default" 
              readOnly 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest ml-1">Platforma roli</label>
            <input 
              type="text" 
              defaultValue="Premium Admin" 
              className="w-full bg-[#F4F7FE] border-none rounded-2xl px-6 py-4 font-bold text-indigo-600 outline-none cursor-default" 
              readOnly 
            />
          </div>
        </div>
      </section>

      {/* Starting Balance with Math logic info */}
      <section className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-50">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 bg-indigo-50 text-[#4318FF] rounded-2xl">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#1B2559]">Mablag'larni boshqarish</h3>
            <p className="text-sm text-[#A3AED0] font-medium">Platformaga kiritiladigan dastlabki kapitalni belgilang</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest ml-1">Boshlang'ich mablag' (so'm)</label>
            <input 
              type="number"
              value={startBal}
              onChange={(e) => setStartBal(e.target.value)}
              className="w-full bg-[#F4F7FE] border-none rounded-2xl px-6 py-4 text-xl font-black text-[#1B2559] outline-none focus:ring-4 focus:ring-[#4318FF]/10 transition-all"
            />
          </div>
          <button 
            onClick={saveBalance}
            className={`whitespace-nowrap px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl ${
              isSaved 
              ? 'bg-emerald-500 text-white shadow-emerald-100' 
              : 'bg-[#1B2559] text-white hover:bg-[#0B1437] shadow-slate-200'
            }`}
          >
            {isSaved ? <><CheckCircle2 className="w-5 h-5" /> Saqlandi!</> : <><Save className="w-5 h-5" /> Saqlash</>}
          </button>
        </div>
        <p className="mt-4 text-[11px] text-[#A3AED0] font-medium italic">
          * Ushbu raqam sizning jami balansingizga qo'shiladi. Agar xatolar kuzatilsa, shu yerni tekshiring.
        </p>
      </section>

      {/* Categories Management UI Refined */}
      <section className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-50">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#1B2559]">Xarajat turlari</h3>
            <p className="text-sm text-[#A3AED0] font-medium">Kategoriyalarni tahrirlash va yangi qo'shish</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#1B2559] uppercase tracking-widest border-b pb-4 border-slate-100">Mavjud bo'limlar</h4>
            <div className="max-h-[300px] overflow-y-auto pr-3 space-y-3">
              {state.categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-4 bg-[#F4F7FE]/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                    <span className="font-bold text-[#1B2559]">{cat.name}</span>
                  </div>
                  {cat.isCustom && (
                    <button onClick={() => removeCategory(cat.id)} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F4F7FE] p-8 rounded-[32px] space-y-5">
            <h4 className="text-xs font-black text-[#1B2559] uppercase tracking-widest">Yangi kategoriya</h4>
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="Bo'lim nomi..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-white border-none rounded-2xl px-5 py-4 font-bold text-[#1B2559] outline-none shadow-sm focus:ring-4 focus:ring-indigo-100"
              />
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
                <span className="text-sm font-bold text-[#A3AED0]">Rangni tanlang:</span>
                <input 
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-12 h-10 rounded-xl cursor-pointer border-none bg-transparent overflow-hidden"
                />
              </div>
              <button 
                onClick={addCategory}
                className="w-full bg-[#4318FF] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#3A24FF] transition-all shadow-xl shadow-indigo-100"
              >
                <Plus className="w-5 h-5" /> Qo'shish
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center gap-2 text-[#A3AED0] text-xs font-bold uppercase tracking-widest">
        <Shield className="w-4 h-4" /> Barcha ma'lumotlar xavfsiz holda qurilmaning o'zida saqlanadi.
      </div>
    </div>
  );
};

export default SettingsView;
