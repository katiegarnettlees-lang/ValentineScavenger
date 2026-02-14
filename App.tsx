
import React, { useState, useEffect } from 'react';
import { INITIAL_STOPS } from './constants';
import { Stop, Clue } from './types';
import { generateClueText, generateClueImage, generateHint } from './services/geminiService';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Gift, 
  ChevronRight, 
  Sparkles, 
  Unlock,
  Loader2,
  Camera,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [clues, setClues] = useState<Clue[]>(
    INITIAL_STOPS.map((stop) => ({
      stopId: stop.id,
      text: '',
      hint: '',
      isUnlocked: stop.id === 1,
      isGenerating: false
    }))
  );
  const [activeTab, setActiveTab] = useState<'hunt' | 'itinerary'>('hunt');
  const [showHint, setShowHint] = useState<boolean>(false);

  const familyInfo = "Parents (53, 47), Teens (16, 15, 15)";

  const handleUnlockClue = async (index: number) => {
    if (clues[index].text) return; 

    const newClues = [...clues];
    newClues[index].isGenerating = true;
    setClues(newClues);

    try {
      const stop = INITIAL_STOPS[index];
      const [text, hint, imageUrl] = await Promise.all([
        generateClueText(stop.location, stop.theme, familyInfo),
        generateHint(stop.location, stop.postcode),
        generateClueImage(stop.location, stop.theme)
      ]);

      const updatedClues = [...clues];
      updatedClues[index] = {
        ...updatedClues[index],
        text,
        hint,
        graphicUrl: imageUrl,
        isGenerating: false,
        isUnlocked: true
      };
      setClues(updatedClues);
    } catch (error) {
      console.error("Error generating clue:", error);
      const updatedClues = [...clues];
      updatedClues[index].isGenerating = false;
      setClues(updatedClues);
    }
  };

  const nextStop = () => {
    if (currentStep < INITIAL_STOPS.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      setShowHint(false); 
      if (!clues[nextIndex].isUnlocked) {
        handleUnlockClue(nextIndex);
      }
    }
  };

  useEffect(() => {
    handleUnlockClue(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentStop = INITIAL_STOPS[currentStep];
  const currentClue = clues[currentStep];

  return (
    <div className="min-h-screen bg-neutral-950 pb-24 text-neutral-100 selection:bg-rose-500/30">
      {/* Header */}
      <header className="bg-neutral-900/80 backdrop-blur-xl border-b border-rose-900/20 p-6 text-center sticky top-0 z-50 shadow-2xl">
        <h1 className="text-4xl font-romantic text-rose-500 mb-1 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">Valentine's Quest</h1>
        <p className="text-rose-400 text-[10px] uppercase tracking-[0.3em] font-black flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-rose-500/20" />
          Devon & Cornwall Loop
          <span className="h-px w-6 bg-rose-500/20" />
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-md mx-auto mt-8 px-4">
        <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800 shadow-inner">
          <button 
            onClick={() => setActiveTab('hunt')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'hunt' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20 scale-100' : 'text-neutral-500 hover:text-neutral-300 scale-95'}`}
          >
            Mission Feed
          </button>
          <button 
            onClick={() => setActiveTab('itinerary')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'itinerary' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20 scale-100' : 'text-neutral-500 hover:text-neutral-300 scale-95'}`}
          >
            Route Ops
          </button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto p-4 mt-6">
        {activeTab === 'hunt' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Clue Card */}
            <div className="bg-neutral-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-neutral-800/50 transition-all duration-500">
              <div className="bg-gradient-to-r from-rose-600 to-pink-700 p-6 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <span className="font-black text-xs tracking-tighter uppercase flex items-center gap-2 relative z-10">
                  <Sparkles size={16} className="text-rose-200" /> Stage {currentStep + 1} // {INITIAL_STOPS.length}
                </span>
                <span className="text-[10px] font-black py-1.5 px-4 bg-black/30 rounded-full border border-white/10 relative z-10">{currentStop.theme}</span>
              </div>

              <div className="p-8">
                {currentClue.isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-28 space-y-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-rose-500/10 blur-3xl rounded-full animate-pulse" />
                      <Loader2 className="animate-spin text-rose-500 relative" size={64} strokeWidth={3} />
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-rose-400 font-black tracking-widest text-lg uppercase animate-pulse">Decrypting Visual Intel...</p>
                      <p className="text-neutral-500 text-xs font-medium">Downloading custom graphic for the squad.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in zoom-in-95 duration-500">
                    {currentClue.graphicUrl && (
                      <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl bg-neutral-950 aspect-square border-4 border-neutral-800/30">
                        <img 
                          src={currentClue.graphicUrl} 
                          alt="Valentine Clue Graphic" 
                          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 shadow-2xl">
                          <p className="text-[10px] font-black tracking-[0.2em] text-rose-500">MISSION_ASSET_HQ</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="relative group">
                      <div className="bg-neutral-950 p-10 rounded-[2.5rem] border border-neutral-800/80 relative z-10 shadow-inner group-hover:border-rose-900/30 transition-all">
                        <p className="text-xl text-neutral-100 leading-relaxed font-bold text-center italic tracking-tight">
                          {currentClue.text || "Scanning for target coordinates..."}
                        </p>
                      </div>
                    </div>

                    {/* Hint Section */}
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowHint(!showHint)}
                        className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:text-rose-300 transition-colors mx-auto"
                      >
                        {showHint ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showHint ? "Hide Location Hint" : "Stuck? Reveal Hint"}
                      </button>
                      
                      {showHint && currentClue.hint && (
                        <div className="bg-neutral-950/50 border border-neutral-800 p-6 rounded-3xl animate-in fade-in slide-in-from-top-2 duration-300">
                           <p className="text-xs text-neutral-400 text-center font-medium leading-relaxed italic">
                             <HelpCircle size={14} className="inline mr-2 text-rose-500/50" />
                             {currentClue.hint}
                           </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-5 bg-rose-950/10 border border-rose-900/20 p-6 rounded-3xl hover:bg-rose-950/20 transition-all">
                      <div className="bg-rose-600/10 p-4 rounded-2xl border border-rose-500/20 shadow-lg">
                        <MapPin size={28} className="text-rose-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-rose-500 tracking-[0.3em] uppercase mb-1">Target Base</p>
                        <p className="text-xl font-black text-neutral-100 tracking-tight">{currentStop.location}</p>
                        <p className="text-xs text-neutral-500 font-mono font-bold tracking-[0.1em]">{currentStop.postcode}</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-neutral-800" />
                        <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em]">Intel Briefing</p>
                        <div className="h-px flex-1 bg-neutral-800" />
                      </div>
                      <p className="text-neutral-400 font-medium leading-relaxed text-center px-6 text-sm italic">{currentStop.activity}</p>
                    </div>

                    {currentStop.jellycatStockist && (
                      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                        <div className="bg-yellow-500 p-4 rounded-2xl shadow-xl shadow-yellow-500/20 relative z-10">
                          <Gift className="text-black" size={32} />
                        </div>
                        <div className="relative z-10">
                          <p className="font-black text-yellow-500 text-sm uppercase tracking-widest mb-1">Jellycat Hub Identified</p>
                          <p className="text-xs text-yellow-500/80 font-bold leading-relaxed">Specific stockist for rare Jellycats. Final opportunity for the 'Heart' mascots.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-8 bg-neutral-950/50 border-t border-neutral-800/50">
                <button 
                  onClick={nextStop}
                  disabled={currentStep === INITIAL_STOPS.length - 1 || currentClue.isGenerating}
                  className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-neutral-800 disabled:text-neutral-700 text-white font-black py-6 rounded-2xl shadow-2xl shadow-rose-900/20 transition-all duration-300 flex items-center justify-center gap-4 group uppercase tracking-[0.2em] text-sm scale-100 active:scale-95 active:bg-rose-700"
                >
                  {currentStep === INITIAL_STOPS.length - 1 ? 'Mission Successful' : 'Deploy Next Stage'}
                  <ChevronRight className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-neutral-900 p-10 rounded-[2.5rem] shadow-2xl border border-neutral-800/50">
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-3xl font-romantic text-rose-500">Route Intel</h2>
                <div className="text-right">
                  <p className="text-rose-500 text-xs font-black tracking-tighter">~5.0 HRS</p>
                  <p className="text-[8px] text-neutral-500 uppercase font-black">Total Runtime</p>
                </div>
              </div>
              <div className="space-y-12">
                {INITIAL_STOPS.map((stop, idx) => (
                  <div key={stop.id} className="relative pl-12 border-l-2 border-neutral-800 last:border-l-0">
                    <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-neutral-900 shadow-2xl transition-all duration-500 ${idx <= currentStep ? 'bg-rose-500 animate-pulse' : 'bg-neutral-800'}`} />
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-rose-500 tracking-[0.2em] uppercase bg-rose-500/10 px-3 py-1 rounded-full">{stop.travelTime}</span>
                        <div className="flex gap-2">
                          {stop.type === 'Lunch' && <span className="bg-blue-900/30 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Base Camp</span>}
                          {stop.jellycatStockist && <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Prize Zone</span>}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-neutral-100 tracking-tight mb-1">{stop.location}</h3>
                        <p className="text-xs text-neutral-500 font-mono flex items-center gap-2"><MapPin size={12} className="text-rose-500/50" /> {stop.postcode}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-br from-rose-600 to-pink-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-2">
              <h4 className="text-xl font-black tracking-tight flex items-center gap-3">
                <Camera size={24} className="text-rose-200" /> Mission Visuals
              </h4>
              <p className="text-xs font-bold text-rose-100/80 tracking-wide uppercase">Confirm coordinates with a group selfie at each base.</p>
            </div>
            <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/20 transition-all hover:rotate-12 active:scale-90">
              <Unlock size={24} />
            </button>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-neutral-900/80 backdrop-blur-2xl border border-white/5 p-4 flex justify-around items-center rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 md:hidden">
        <button 
          onClick={() => setActiveTab('hunt')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'hunt' ? 'text-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-neutral-600 hover:text-neutral-400'}`}
        >
          <Sparkles size={24} />
          <span className="text-[9px] font-black tracking-widest uppercase">Quest</span>
        </button>
        <div className="h-8 w-px bg-neutral-800" />
        <button 
          onClick={() => setActiveTab('itinerary')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'itinerary' ? 'text-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-neutral-600 hover:text-neutral-400'}`}
        >
          <MapPin size={24} />
          <span className="text-[9px] font-black tracking-widest uppercase">Map</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
