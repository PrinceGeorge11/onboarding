import React, { useEffect, useMemo, useState } from "react";
const FACILITIES = [
  { name: "MTCC (Student Center)", coords: [41.8359, -87.6277], type: "Student Services" },
  { name: "Galvin Library", coords: [41.8346, -87.6278], type: "Library" },
  { name: "Keating Sports Center", coords: [41.8369, -87.6249], type: "Recreation" },
  { name: "Hermann Hall", coords: [41.8337, -87.6269], type: "Events" },
  { name: "Crown Hall", coords: [41.8343, -87.6260], type: "Academic" },
  { name: "Stuart Building", coords: [41.8356, -87.6270], type: "Academic" }
];
const CAMPUS_CENTER = [41.835, -87.627];
function haversine([lat1, lon1], [lat2, lon2]) {
  const R = 6371e3; const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export default function LocationServices() {
  const [pos, setPos] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!("geolocation" in navigator)) { setError("Geolocation not supported. Using campus center."); setPos(CAMPUS_CENTER); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setPos([p.coords.latitude, p.coords.longitude]),
      () => { setError("Permission denied. Using campus center."); setPos(CAMPUS_CENTER); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);
  const nearest = useMemo(() => {
    if (!pos) return [];
    return [...FACILITIES].map(f => ({...f, distance: haversine(pos, f.coords)})).sort((a,b)=>a.distance-b.distance).slice(0,4);
  }, [pos]);
  return (
    <div className="space-y-4">
      <div className="text-sm text-black/70">{error || "Showing nearby campus facilities based on your current location."}</div>
      <div className="grid sm:grid-cols-2 gap-4">
        {nearest.map(f => (
          <div key={f.name} className="rounded-2xl p-5 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="font-bold">{f.name}</div>
            <div className="text-sm text-black/70">{f.type}</div>
            <div className="text-xs text-black/60 mt-1">{(f.distance/1000).toFixed(2)} km away</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-black/50">Distances are approximate. Location is processed in your browser only.</p>
    </div>
  );
}
