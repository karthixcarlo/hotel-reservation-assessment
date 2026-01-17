import React from 'react';

const RoomGrid = ({ rooms, justBooked }) => {
    const floors = {};
    for (let i = 1; i <= 10; i++) floors[i] = [];

    if (rooms) {
        rooms.forEach(room => floors[room.floor].push(room));
    }
    Object.keys(floors).forEach(f => floors[f].sort((a, b) => a.index - b.index));

    const floorRows = [];
    for (let f = 10; f >= 1; f--) {
        floorRows.push({ number: f, rooms: floors[f] });
    }

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden">
            <div className="bg-white border-b border-slate-100 p-5 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Live Occupancy Map</h2>
                    <p className="text-slate-500 text-xs mt-1">Real-time status of 97 rooms across 10 floors.</p>
                </div>
                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-200 border border-slate-300"></span> Occupied
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span> Just Allocated
                    </div>
                </div>
            </div>

            <div className="p-6 bg-slate-50/30 space-y-2.5">
                {floorRows.map((floor) => (
                    <div key={floor.number} className="flex items-center gap-4">
                        {/* Floor Label */}
                        <div className="w-16 flex-shrink-0 flex flex-col items-end opacity-60">
                            <span className="text-[10px] font-bold uppercase tracking-wider">Floor</span>
                            <span className="text-base font-bold font-mono">{String(floor.number).padStart(2, '0')}</span>
                        </div>

                        {/* Floor Container */}
                        <div className={`
              flex-1 relative flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 bg-white shadow-sm
              ${floor.number === 10 ? 'max-w-[75%]' : 'w-full'}
            `}>
                            {/* Lift visuals */}
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 bg-slate-200 rounded-full"></div>

                            {floor.rooms.map((room) => {
                                const isJustBooked = justBooked.has(room.number);
                                const isOccupied = room.is_occupied;

                                // Dynamic Classes
                                let baseClasses = "flex-1 h-10 rounded md:rounded-md flex items-center justify-center text-[10px] md:text-xs font-bold transition-all duration-500 relative overflow-hidden font-mono border";
                                let colorClasses = "";

                                if (isJustBooked) {
                                    colorClasses = "bg-indigo-600 text-white border-indigo-700 shadow-md scale-105 z-100";
                                } else if (isOccupied) {
                                    colorClasses = "bg-slate-100 text-slate-300 border-slate-100 shadow-inner";
                                } else {
                                    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-300 hover:shadow-sm cursor-default";
                                }

                                return (
                                    <div key={room.number} className={`${baseClasses} ${colorClasses}`} title={`Room ${room.number}`}>
                                        {room.number}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomGrid;
