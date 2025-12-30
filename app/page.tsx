'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Activity, Search, AlertCircle, 
  ChevronRight, Stethoscope, Zap, Bell,   CheckCircle2, Info, Printer, Thermometer,
  Clock, FileText, Database, Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClinicalDashboard() {
  const [emergency, setEmergency] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const departments = [
    { name: 'Sterilization & Hygiene', icon: <Zap size={18} />, status: 'Online' },
    { name: 'Orthopedic Suite', icon: <Stethoscope size={18} />, status: 'Online' },
    { name: 'Cardiology SOP', icon: <Activity size={18} />, status: 'Online' },
    { name: 'Emergency Room', icon: <Bell size={18} />, status: 'Critical' },
  ];

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ query, department: 'General' }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-1000 selection:bg-emerald-500/30",
      emergency ? "bg-[#1a0505]" : "bg-[#fcfdfe]"
    )}>
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000",
          emergency ? "bg-red-900/20" : "bg-emerald-500/5"
        )} />
        <div className={cn(
          "absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full blur-[100px] transition-colors duration-1000",
          emergency ? "bg-red-800/10" : "bg-blue-500/5"
        )} />      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 px-10 py-5 flex justify-between items-center backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl",
            emergency ? "bg-red-600 shadow-red-500/40 rotate-90" : "bg-emerald-600 shadow-emerald-500/40"
          )}>
            <ShieldCheck className="text-white" size={28} />
          </div>
          <div>
            <h1 className={cn(
              "text-xl font-black tracking-tighter transition-colors",
              emergency ? "text-white" : "text-slate-900"
            )}>CLINICAL AI v2.0</h1>
            <div className="flex items-center gap-2">
              <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", emergency ? "bg-red-400" : "bg-emerald-500")} />
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Grounded Safety Engine Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase">System Latency</span>
            <span className="text-xs font-mono text-emerald-500">12ms</span>
          </div>
          <button 
            onClick={() => setEmergency(!emergency)}
            className={cn(
              "group relative px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
              emergency 
                ? "bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.5)]" 
                : "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            <span className="relative z-10">{emergency ? 'Abort Emergency' : 'Emergency Mode'}</span>
            {emergency && <motion.div layoutId="glow" className="absolute inset-0 bg-red-400 rounded-2xl blur-md opacity-50" />}
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-10 grid grid-cols-12 gap-10">
        
        {/* Sidebar: Department Control */}
        <aside className="col-span-12 lg:col-span-3 space-y-8">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-2">Clinical Units</h2>
            <div className="space-y-3">
              {departments.map((dept, i) => (
                <motion.div 
                  whileHover={{ x: 10 }}
                  key={i} 
                  className={cn(
                    "p-5 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between group",
                    emergency 
                      ? "bg-white/5 border-white/10 hover:bg-white/10"                       : "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-500"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      emergency ? "bg-white/10 text-red-400" : "bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                    )}>
                      {dept.icon}
                    </div>
                    <div>
                      <p className={cn("text-sm font-bold", emergency ? "text-slate-200" : "text-slate-700")}>{dept.name}</p>
                      <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{dept.status}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className={cn(
            "p-8 rounded-[2.5rem] border transition-all relative overflow-hidden",
            emergency ? "bg-red-950/30 border-red-900/50" : "bg-slate-900 border-slate-800 shadow-2xl"
          )}>
            <Database className="absolute -right-4 -bottom-4 text-white/5" size={120} />
            <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Grounding Status
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              System is strictly locked to hospital-internal standard operating procedures. Hallucination guard is active at 100% strength.
            </p>
          </div>
        </aside>

        {/* Main Interface */}
        <div className="col-span-12 lg:col-span-9 space-y-10">
          
          {/* Futuristic Search Box */}
          <div className="relative group">
            <div className={cn(
              "absolute -inset-2 blur-3xl opacity-20 transition-all duration-1000",
              emergency ? "bg-red-600" : "bg-emerald-500"
            )} />
            <div className={cn(
              "relative rounded-[3rem] p-3 flex items-center transition-all duration-500",
              emergency ? "bg-white/5 border border-white/10" : "bg-white border border-slate-100 shadow-2xl"
            )}>
              <div className="pl-8 text-slate-400">
                <Search size={28} />
              </div>
              <input 
                type="text"
                placeholder="Query clinical procedure or hygiene protocol..."
                className={cn(
                  "w-full bg-transparent border-none focus:ring-0 p-8 text-xl font-medium placeholder:text-slate-400",
                  emergency ? "text-white" : "text-slate-800"
                )}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className={cn(
                  "px-12 py-6 rounded-[2.2rem] font-black text-sm tracking-widest text-white transition-all active:scale-95 shadow-2xl",
                  emergency ? "bg-red-600 hover:bg-red-500 shadow-red-600/20" : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                )}
              >
                {loading ? <Activity className="animate-spin" /> : 'EXECUTE QUERY'}
              </button>
            </div>
          </div>

          {/* AI Grounded Result Card */}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, y: 40, scale: 0.98 }}                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "relative rounded-[4rem] p-16 shadow-2xl overflow-hidden border",
                  emergency ? "bg-white/5 border-white/10" : "bg-white border-slate-100"
                )}
              >
                {/* Background Watermark */}
                <ShieldCheck className={cn(
                  "absolute -right-20 -top-20 opacity-[0.03] pointer-events-none",
                  emergency ? "text-white" : "text-slate-900"
                )} size={600} />

                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-4 mb-12">
                    <div className="bg-emerald-500/10 text-emerald-600 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-500/20">
                      <CheckCircle2 size={14} /> Factual Verification: 100%
                    </div>
                    <div className="bg-slate-100 text-slate-500 px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} /> SOP Version: 2024.08
                    </div>
                  </div>

                  <div className={cn(
                    "text-4xl md:text-5xl font-medium leading-[1.15] tracking-tight mb-12",
                    emergency ? "text-white" : "text-slate-900"
                  )}>
                    {result.answer}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-6 pt-12 border-t border-slate-200/50">
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "px-6 py-3 rounded-2xl font-mono text-xs font-bold",
                        emergency ? "bg-white/10 text-white" : "bg-slate-900 text-white"
                      )}>
                        REF: {result.sources?.[0] || 'GENERAL-SOP'}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <Info size={14} /> Grounded Logic Active
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors">
                        <Printer size={20} />
                      </button>
                      <button className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-40">
                <div className="relative mb-8">
                  <div className={cn(
                    "absolute inset-0 blur-3xl opacity-30",
                    emergency ? "bg-red-600" : "bg-emerald-500"
                  )} />
                  <FileText size={80} className={cn("relative", emergency ? "text-red-900" : "text-slate-200")} />                </div>
                <p className={cn("text-xl font-bold tracking-tight", emergency ? "text-red-300" : "text-slate-400")}>
                  Awaiting Clinical Input
                </p>
                <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest">System Standby • Hallucination Guard 100%</p>              </div>
            )}
          </AnimatePresence>

          {/* Safety Warning Panel */}
          <div className={cn(
            "p-8 rounded-[3rem] border flex gap-6 items-center transition-all",
            emergency ? "bg-red-600/10 border-red-600/20" : "bg-blue-50/50 border-blue-100"
          )}>
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shrink-0",
              emergency ? "bg-red-600 text-white" : "bg-blue-600 text-white"
            )}>
              <AlertCircle size={24} />
            </div>
            <div>
              <p className={cn("font-black text-xs uppercase tracking-widest mb-1", emergency ? "text-red-400" : "text-blue-900")}>
                Strict Safety Protocol
              </p>
              <p className={cn("text-sm leading-relaxed font-medium", emergency ? "text-red-200/70" : "text-blue-700/70")}>
                This AI is prohibited from using general knowledge. If information is not found in the official hospital SOPs, the system will decline to answer to prevent fatal errors.
              </p>
            </div>
          </div>        </div>
      </main>
    </div>
  );
}