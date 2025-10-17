import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const CAMPUS_CENTER = [41.835, -87.627];
const FACILITIES = [
  { name: "MTCC (Student Center)", coords: [41.8359, -87.6277], hours: "Mon–Fri 7am–10pm", desc: "Student services, dining, study spaces." },
  { name: "Galvin Library", coords: [41.8346, -87.6278], hours: "Mon–Thu 8am–10pm; Fri 8am–6pm", desc: "Research help, study rooms, TechCommons." },
  { name: "Crown Hall", coords: [41.8343, -87.6260], hours: "Varies by event", desc: "S.R. Crown Hall — College of Architecture." },
  { name: "Hermann Hall", coords: [41.8337, -87.6269], hours: "Varies", desc: "Events, ballroom, conference services." },
  { name: "Keating Sports Center", coords: [41.8369, -87.6249], hours: "Mon–Fri 6am–10pm; Sat–Sun 8am–8pm", desc: "Gym, fitness, athletics." },
  { name: "Stuart Building", coords: [41.8356, -87.6270], hours: "Mon–Fri 8am–6pm", desc: "Classrooms, labs, offices." }
];

export default function CampusMap() {
  return (
    <div className="relative z-0 rounded-2xl overflow-hidden border border-black/10">
      <MapContainer center={CAMPUS_CENTER} zoom={16} style={{ height: 520, width: "100%" }} scrollWheelZoom>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {FACILITIES.map(f => (
          <Marker key={f.name} position={f.coords}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{f.name}</div>
                <div className="text-black/70">{f.desc}</div>
                <div className="mt-1 text-xs text-black/60">Hours: {f.hours}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
