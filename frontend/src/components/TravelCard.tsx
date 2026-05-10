import { MapPin, Clock, IndianRupee, Navigation, Palmtree, Sparkles } from "lucide-react";

export interface TripSuggestion {
  destination: string;
  distance_km: number;
  travel_time_hours: string;
  vibe: string;
  estimated_cost_inr: number;
  why_it_fits: string;
}

interface Props {
  trips?: TripSuggestion[];
  city?: string;
}

export function TravelCard({ trips, city = "your city" }: Props) {
  if (!trips || trips.length === 0) return null;

  return (
    <div className="glass-card p-6 fade-in-up mt-8 border" style={{ borderColor: "var(--accent-orange)30" }}>
      <div className="flex items-center gap-2 mb-2">
        <Palmtree size={24} style={{ color: "var(--accent-orange)" }} />
        <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Weekend Escapes
        </h3>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Based on your salary and budget, here are 3 personalized weekend getaways from {city}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trips.map((trip, i) => (
          <div key={i} className="p-4 rounded-xl border flex flex-col h-full"
               style={{ background: "var(--bg-input)", borderColor: "var(--border-default)" }}>
            
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-base font-bold text-white">{trip.destination}</h4>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-orange-500/10 text-orange-400">
                {trip.vibe}
              </span>
            </div>

            <div className="space-y-2 mt-3 text-xs text-gray-400 mb-4 flex-grow">
              <p className="flex items-center gap-1.5">
                <Navigation size={12} className="text-indigo-400" /> {trip.distance_km} km away
              </p>
              <p className="flex items-center gap-1.5">
                <Clock size={12} className="text-indigo-400" /> {trip.travel_time_hours} drive
              </p>
              <p className="flex items-center gap-1.5 text-emerald-400 font-medium mt-2">
                <IndianRupee size={12} /> Est. ₹{trip.estimated_cost_inr.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="pt-3 mt-auto border-t border-gray-800">
              <p className="text-xs text-indigo-300 italic flex items-start gap-1.5">
                <Sparkles size={12} className="shrink-0 mt-0.5" />
                "{trip.why_it_fits}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
