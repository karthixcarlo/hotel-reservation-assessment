import React, { useState, useEffect } from 'react';
import RoomGrid from './components/RoomGrid';
import Controls from './components/Controls';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [rooms, setRooms] = useState([]);
  const [justBooked, setJustBooked] = useState(new Set());
  const [lastStats, setLastStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingSize, setBookingSize] = useState(1);

  const fetchState = async () => {
    try {
      const res = await fetch(`${API_URL}/state`);
      const data = await res.json();
      setRooms(data.rooms);
    } catch (err) {
      console.error("Failed to fetch state:", err);
      setError("System Offline. Please restart backend service.");
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleBook = async () => {
    setLoading(true);
    setError(null);
    setJustBooked(new Set());
    setLastStats(null);

    try {
      const res = await fetch(`${API_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: bookingSize }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Allocation Failed');
      }

      const data = await res.json();

      const bookedIds = new Set(data.booked_rooms.map(r => r.number));
      setJustBooked(bookedIds);
      setLastStats(data);
      await fetchState();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimpleAction = async (endpoint) => {
    setLoading(true);
    setError(null);
    setJustBooked(new Set());
    setLastStats(null);
    try {
      await fetch(`${API_URL}/${endpoint}`, { method: 'POST' });
      await fetchState();
    } catch (err) {
      setError(`Action failed.`);
    } finally {
      setLoading(false);
    }
  }

  const handleScenario = async (id) => {
    let endpoint = '';
    if (id === 1) endpoint = 'scenario/recruiter_1';
    if (id === 2) endpoint = 'scenario/recruiter_2';

    setLoading(true);
    setJustBooked(new Set());
    setLastStats(null);

    try {
      // 1. Initialize Test State
      await fetch(`${API_URL}/${endpoint}`, { method: 'POST' });

      // 2. Set Visual Input (Requirement K=4)
      setBookingSize(4);

      // 3. Auto-Execute Allocation (Demonstration Mode)
      // Small delay to let the user see the "Reset" state visually before booking (optional, but good for demo)
      // We'll run it immediately for responsiveness as requested.
      const res = await fetch(`${API_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: 4 }),
      });

      if (!res.ok) {
        throw new Error("Demonstration Allocation Failed");
      }

      const data = await res.json();
      const bookedIds = new Set(data.booked_rooms.map(r => r.number));
      setJustBooked(bookedIds);
      setLastStats(data);

      // 4. Update View
      await fetchState();

    } catch (err) {
      setError(`Test Scenario Failed:, ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Professional Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="bg-slate-900 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </span>
              SmartStay System
            </h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Advanced Room Allocation Algorithm • SDE 3 Assessment
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 mt-4 md:mt-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System State</div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700">Operational</span>
            </div>
          </div>
        </header>

        <main className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Controls Panel */}
          <section className="w-full lg:w-[360px] flex-shrink-0">
            <Controls
              onBook={handleBook}
              onReset={() => handleSimpleAction('reset')}
              onRandomize={() => handleSimpleAction('randomize')}
              onScenario={handleScenario}
              size={bookingSize}
              setSize={setBookingSize}
              loading={loading}
              lastStats={lastStats}
              error={error}
            />
          </section>

          {/* Visualization Grid */}
          <section className="flex-1 w-full">
            <RoomGrid rooms={rooms} justBooked={justBooked} />
          </section>
        </main>

        <footer className="mt-12 text-center text-slate-400 text-xs border-t border-slate-200 pt-6 font-medium">
          <p>Algorithm Verification Environment • v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
