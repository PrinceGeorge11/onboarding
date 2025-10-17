import React, { useMemo, useState } from "react";

const BUILDINGS = [
  { name: "MTCC (Student Center)", hours: "Mon–Fri 7am–10pm", services: "Student services, dining, study spaces", accessible: "Yes" },
  { name: "Galvin Library", hours: "Mon–Thu 8am–10pm; Fri 8am–6pm", services: "Research help, TechCommons, study rooms", accessible: "Yes" },
  { name: "Crown Hall", hours: "Varies", services: "College of Architecture events and studios", accessible: "Yes" },
  { name: "Hermann Hall", hours: "Varies", services: "Events, conference services", accessible: "Yes" },
  { name: "Keating Sports Center", hours: "Mon–Fri 6am–10pm; Sat–Sun 8am–8pm", services: "Gym, fitness, athletics", accessible: "Yes" },
  { name: "Stuart Building", hours: "Mon–Fri 8am–6pm", services: "Classrooms, labs, offices", accessible: "Yes" }
];

export default function BuildingInfo() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return BUILDINGS.filter(b => b.name.toLowerCase().includes(s) || b.services.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="space-y-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search buildings or services…"
        className="w-full rounded-xl px-4 py-3 border border-black/10 focus:outline-none focus:ring-2"
      />
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(b => (
          <div key={b.name} className="rounded-2xl p-5 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="font-bold">{b.name}</div>
            <div className="text-sm text-black/70 mt-1">{b.services}</div>
            <div className="text-xs text-black/60 mt-2">Hours: {b.hours}</div>
            <div className="text-xs text-black/60">Accessible: {b.accessible}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
