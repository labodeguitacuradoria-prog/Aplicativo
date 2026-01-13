
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, PlusCircle, Wine, TrendingUp, 
  DollarSign, Percent, Info, Package, Square, ChevronRight, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList 
} from 'recharts';

// --- CONFIGURAÇÕES ---
const RESTAURANTS = ['BRIQUE', 'QUINTANA', 'VERÍSSIMO', 'VISTTA', 'HAMPEL', 'NAPOLI'];
const COLORS: Record<string, string> = {
  'BRIQUE': '#ef4444', 'QUINTANA': '#bef264', 'VERÍSSIMO': '#f97316',
  'VISTTA': '#1e40af', 'HAMPEL': '#7c3aed', 'NAPOLI': '#db2777'
};
const MONTHS_SHORT = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const App: React.FC = () => {
  const [view, setView] = useState<'WELCOME' | 'DASH' | 'ENTRY'>('WELCOME');
  const [isAnnual, setIsAnnual] = useState(false);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('bah_data_v2');
    return saved ? JSON.parse(saved) : [{
      month: '2025-01',
      restaurants: {
        'BRIQUE': { sales: 8500 }, 'QUINTANA': { sales: 12400 },
        'VERÍSSIMO': { sales: 9800 }, 'VISTTA': { sales: 15600 }
      }
    }];
  });

  const currentYear = "2025";
  const report = data[data.length - 1];

  // Gráfico Anual (Evolução Mensal do Grupo)
  const annualData = useMemo(() => {
    return MONTHS_SHORT.map((m, i) => {
      const mStr = `${currentYear}-${(i+1).toString().padStart(2, '0')}`;
      const r = data.find((x: any) => x.month === mStr);
      const total = r ? Object.values(r.restaurants).reduce((a: any, b: any) => a + (b.sales || 0), 0) : 0;
      return { name: m, sales: total };
    });
  }, [data]);

  // Gráfico Mensal (Por Unidade)
  const unitData = useMemo(() => {
    return Object.keys(report.restaurants).map(name => ({
      name,
      sales: report.restaurants[name].sales || 0,
      color: COLORS[name]
    })).filter(d => d.sales > 0);
  }, [report]);

  // Added explicit types to reduce callback to fix line 56 error: "Operator '+' cannot be applied to types 'number' and 'unknown'"
  const totalSales = isAnnual 
    ? annualData.reduce((a: number, b: any) => a + (b.sales || 0), 0)
    : unitData.reduce((a: number, b: any) => a + (b.sales || 0), 0);

  // --- COMPONENTES INTERNOS ---
  const Welcome = () => (
    <div className="h-screen flex flex-col items-start justify-center p-10 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <h1 className="text-6xl font-black leading-tight mb-4">Gestão 360°<br/><span className="text-purple-500">Grupo BAH</span></h1>
      <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] mb-10 text-xs">Vinhos & Performance</p>
      <button 
        onClick={() => setView('DASH')}
        className="group flex items-center gap-4 bg-white text-black pl-2 pr-8 py-2 rounded-full font-black transition-transform active:scale-95"
      >
        <div className="bg-black p-3 rounded-full text-white"><LayoutDashboard size={20}/></div>
        ACESSAR DASHBOARD
      </button>
    </div>
  );

  const Dashboard = () => (
    <div className="p-4 pb-32 animate-in fade-in duration-500">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-1 mb-8 flex">
        <button onClick={() => setIsAnnual(false)} className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all ${!isAnnual ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-zinc-500'}`}>MENSAL</button>
        <button onClick={() => setIsAnnual(true)} className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all ${isAnnual ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-zinc-500'}`}>ANUAL {currentYear}</button>
      </div>

      <div className="mb-8 px-1">
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Performance consolidada</p>
        <h2 className="text-4xl font-black uppercase leading-none">{isAnnual ? `Ano ${currentYear}` : 'Janeiro'}</h2>
      </div>

      <div className="bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800 shadow-2xl mb-6">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase mb-8 flex items-center gap-2">
          <TrendingUp size={12} className="text-purple-500" />
          {isAnnual ? 'Faturamento Consolidado do Grupo' : 'Faturamento por Unidade'}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={isAnnual ? annualData : unitData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#444'}} />
              <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '15px'}} />
              <Bar dataKey="sales" radius={[8, 8, 0, 0]} barSize={isAnnual ? 15 : 35}>
                {isAnnual 
                  ? annualData.map((e, i) => <Cell key={i} fill="#7c3aed" />)
                  : unitData.map((e, i) => <Cell key={i} fill={e.color} />)
                }
                <LabelList dataKey="sales" position="top" fill="#666" fontSize={8} formatter={(v: any) => v > 0 ? `${(v/1000).toFixed(1)}k` : ''} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800">
          <DollarSign className="text-green-500 mb-2" size={20} />
          <p className="text-[10px] font-black text-zinc-500 uppercase">Faturamento</p>
          <p className="text-xl font-black">R$ {totalSales.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800">
          <Wine className="text-purple-500 mb-2" size={20} />
          <p className="text-[10px] font-black text-zinc-500 uppercase">Garrafas</p>
          <p className="text-xl font-black">342</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen">
      {view === 'WELCOME' && <Welcome />}
      {view === 'DASH' && <Dashboard />}
      {view === 'ENTRY' && (
        <div className="p-10">
          <h2 className="text-3xl font-black mb-8">Lançar Dados</h2>
          <p className="text-zinc-500 italic">Interface de lançamento em desenvolvimento...</p>
        </div>
      )}

      {view !== 'WELCOME' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-zinc-800 p-5 flex justify-around items-center z-50 max-w-md mx-auto">
          <button onClick={() => setView('DASH')} className={`flex flex-col items-center gap-1 ${view === 'DASH' ? 'text-purple-500' : 'text-zinc-600'}`}>
            <LayoutDashboard size={24} />
            <span className="text-[8px] font-black uppercase">Dash</span>
          </button>
          <button onClick={() => setView('ENTRY')} className={`flex flex-col items-center gap-1 ${view === 'ENTRY' ? 'text-purple-500' : 'text-zinc-600'}`}>
            <PlusCircle size={24} />
            <span className="text-[8px] font-black uppercase">Lançar</span>
          </button>
          <button onClick={() => setView('WELCOME')} className="flex flex-col items-center gap-1 text-zinc-600">
            <Wine size={24} />
            <span className="text-[8px] font-black uppercase">Sair</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
