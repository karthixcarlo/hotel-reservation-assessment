import React from 'react';

const Controls = ({ onBook, onReset, onRandomize, loading, lastStats, error, onScenario, size, setSize }) => {

    const handleBook = () => {
        onBook();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] border border-slate-200/60">
                <div className="mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Reservation Controls</h2>
                    <p className="text-slate-500 text-xs mt-1">Configure booking parameters.</p>
                </div>

                {/* Room Input */}
                <div className="mb-6">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Required Rooms (K)
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSize(Math.max(1, size - 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium disabled:opacity-50"
                            disabled={loading || size <= 1}
                        >
                            −
                        </button>
                        <div className="flex-1 h-10 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 font-mono text-lg font-bold text-slate-800">
                            {size}
                        </div>
                        <button
                            onClick={() => setSize(Math.min(5, size + 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium disabled:opacity-50"
                            disabled={loading || size >= 5}
                        >
                            +
                        </button>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 px-1 mt-1.5 font-medium">
                        <span>Min Constraint: 1</span>
                        <span>Max Constraint: 5</span>
                    </div>
                </div>

                {/* Primary Action */}
                <button
                    onClick={handleBook}
                    disabled={loading}
                    className="w-full relative overflow-hidden rounded-lg bg-slate-900 py-3 px-4 text-white shadow-md shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed mb-4 active:scale-[0.98]"
                >
                    <span className="relative z-10 font-bold text-sm tracking-wide flex items-center justify-center gap-2">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Processing...
                            </span>
                        ) : (
                            "Execute Allocation"
                        )}
                    </span>
                </button>

                {/* Utility Actions */}
                <div className="grid grid-cols-2 gap-3 pb-6 border-b border-slate-100">
                    <button
                        onClick={onRandomize}
                        disabled={loading}
                        className="py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                        Randomize State
                    </button>
                    <button
                        onClick={onReset}
                        disabled={loading}
                        className="py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-100 transition-all"
                    >
                        Reset System
                    </button>
                </div>

                {/* Verification Suite */}
                <div className="mt-6">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Verification Suite</p>

                    <div className="space-y-2.5">
                        <button
                            onClick={() => onScenario(1)}
                            disabled={loading}
                            className="w-full text-left p-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex items-center justify-between group"
                        >
                            <div>
                                <span className="text-xs font-bold block text-slate-700">Run Optimization Test</span>
                                <span className="text-[10px] text-slate-400">Verifies complex clustering (F1)</span>
                            </div>
                            <span className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </span>
                        </button>

                        <button
                            onClick={() => onScenario(2)}
                            disabled={loading}
                            className="w-full text-left p-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex items-center justify-between group"
                        >
                            <div>
                                <span className="text-xs font-bold block text-slate-700">Run Constraint Test</span>
                                <span className="text-[10px] text-slate-400">Verifies skipping rule (Skip F1)</span>
                            </div>
                            <span className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </span>
                        </button>
                    </div>
                </div>

            </div>

            {/* Notifications */}
            {error && (
                <div className="bg-white border-l-4 border-red-500 shadow-sm p-4 rounded-r-lg flex gap-3 items-start animate-fade-in">
                    <div className="flex-1">
                        <h4 className="text-xs font-bold text-red-700 uppercase tracking-wide">Allocation Error</h4>
                        <p className="text-xs text-slate-600 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {lastStats && (
                <div className="bg-white border-l-4 border-emerald-500 shadow-sm p-4 rounded-r-lg animate-fade-in">
                    <div className="mb-2">
                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Allocation Successful</h4>
                        <div className="text-2xl font-black text-slate-800 mt-1">
                            {lastStats.travel_time} <span className="text-xs text-slate-400 font-normal">min travel time</span>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned Rooms</p>
                        <p className="font-mono text-sm text-slate-700 font-semibold">{lastStats.booked_rooms.map(r => r.number).join(', ')}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Controls;
