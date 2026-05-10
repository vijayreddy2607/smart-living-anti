import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";
import { Map as MapIcon, Utensils, Dumbbell, Home } from "lucide-react";
import type { AreaRecommendation } from "./AreaCard";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.75rem",
};

// City center fallbacks — used when area coords are unavailable
const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  "Pune":      { lat: 18.5204, lng: 73.8567 },
  "Bengaluru": { lat: 12.9716, lng: 77.5946 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Chennai":   { lat: 13.0827, lng: 80.2707 },
  "Mumbai":    { lat: 19.0760, lng: 72.8777 },
};

const defaultCenter = CITY_CENTERS["Pune"];

// Coordinates for all 25 neighborhoods across 5 cities
const AREA_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Pune (8 areas)
  "Kharadi":       { lat: 18.5515, lng: 73.9348 },
  "Viman Nagar":   { lat: 18.5665, lng: 73.9122 },
  "Hadapsar":      { lat: 18.5089, lng: 73.9259 },
  "Hinjewadi":     { lat: 18.5913, lng: 73.7389 },
  "Baner":         { lat: 18.5590, lng: 73.7868 },
  "Wakad":         { lat: 18.5987, lng: 73.7688 },
  "Koregaon Park": { lat: 18.5362, lng: 73.8939 },
  "Shivajinagar":  { lat: 18.5314, lng: 73.8446 },

  // Bengaluru (5 areas)
  "Whitefield":     { lat: 12.9698, lng: 77.7499 },
  "Koramangala":    { lat: 12.9352, lng: 77.6245 },
  "HSR Layout":     { lat: 12.9116, lng: 77.6389 },
  "Indiranagar":    { lat: 12.9784, lng: 77.6408 },
  "Electronic City": { lat: 12.8399, lng: 77.6770 },

  // Hyderabad (5 areas)
  "HITEC City":   { lat: 17.4435, lng: 78.3772 },
  "Gachibowli":   { lat: 17.4401, lng: 78.3489 },
  "Kondapur":     { lat: 17.4600, lng: 78.3607 },
  "Madhapur":     { lat: 17.4483, lng: 78.3915 },
  "Banjara Hills":{ lat: 17.4156, lng: 78.4348 },

  // Chennai (5 areas)
  "Sholinganallur":     { lat: 12.9010, lng: 80.2279 },
  "Perungudi":          { lat: 12.9562, lng: 80.2406 },
  "Adyar":              { lat: 13.0012, lng: 80.2565 },
  "OMR (Thoraipakkam)": { lat: 12.9176, lng: 80.2281 },
  "Velachery":          { lat: 12.9750, lng: 80.2213 },

  // Mumbai (5 areas)
  "Powai":              { lat: 19.1176, lng: 72.9060 },
  "Andheri East":       { lat: 19.1136, lng: 72.8697 },
  "BKC (Bandra Kurla)": { lat: 19.0596, lng: 72.8654 },
  "Thane":              { lat: 19.2183, lng: 72.9781 },
  "Navi Mumbai":        { lat: 19.0330, lng: 73.0297 },
};

interface MapCardProps {
  areas: AreaRecommendation[];
}

export function MapCard({ areas }: MapCardProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "housing" | "food" | "fitness">("all");

  // Compute the center of the map based on the top 3 recommended areas.
  // Falls back to the city center if specific area coords are unknown.
  const center = useMemo(() => {
    if (!areas || areas.length === 0) return defaultCenter;

    // Try averaging known area coords
    let latSum = 0;
    let lngSum = 0;
    let count = 0;
    areas.forEach((area) => {
      const coords = AREA_COORDINATES[area.area_name];
      if (coords) {
        latSum += coords.lat;
        lngSum += coords.lng;
        count++;
      }
    });
    if (count > 0) return { lat: latSum / count, lng: lngSum / count };

    // Fall back to city-level center
    const cityName = areas[0]?.city;
    return CITY_CENTERS[cityName] ?? defaultCenter;
  }, [areas]);

  if (loadError) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center text-center h-[300px]">
        <p style={{ color: "var(--accent-rose)" }}>Error loading Google Maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center text-center h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3"></div>
        <p style={{ color: "var(--text-muted)" }}>Loading Map...</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 fade-in-up">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <MapIcon size={20} style={{ color: "var(--accent-indigo)" }} />
          <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            Recommended Locations
          </h3>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filter === "all" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("housing")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${filter === "housing" ? "bg-indigo-900/50 text-indigo-400" : "text-gray-400 hover:text-gray-200"}`}
          >
            <Home size={12} /> Housing
          </button>
          <button
            onClick={() => setFilter("food")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${filter === "food" ? "bg-rose-900/50 text-rose-400" : "text-gray-400 hover:text-gray-200"}`}
          >
            <Utensils size={12} /> Food
          </button>
          <button
            onClick={() => setFilter("fitness")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${filter === "fitness" ? "bg-emerald-900/50 text-emerald-400" : "text-gray-400 hover:text-gray-200"}`}
          >
            <Dumbbell size={12} /> Fitness
          </button>
        </div>
      </div>
      
      <div className="relative w-full h-[350px] rounded-xl overflow-hidden shadow-inner border" style={{ borderColor: "var(--border-default)" }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={11.5}
          center={center}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            styles: [
              {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [{ "weight": "2.00" }]
              },
              {
                "featureType": "all",
                "elementType": "geometry.stroke",
                "stylers": [{ "color": "#9c9c9c" }]
              },
              {
                "featureType": "all",
                "elementType": "labels.text",
                "stylers": [{ "visibility": "on" }]
              },
              {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{ "color": "#f2f2f2" }]
              },
              {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [{ "color": "#ffffff" }]
              },
              {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [{ "color": "#ffffff" }]
              },
              {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{ "visibility": "off" }]
              },
              {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
              },
              {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{ "color": "#eeeeee" }]
              },
              {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#7b7b7b" }]
              },
              {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": "#ffffff" }]
              },
              {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{ "visibility": "simplified" }]
              },
              {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{ "visibility": "off" }]
              },
              {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{ "visibility": "off" }]
              },
              {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
              },
              {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [{ "color": "#c8d7d4" }]
              },
              {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#070707" }]
              },
              {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": "#ffffff" }]
              }
            ]
          }}
        >
          {/* Housing Markers */}
          {(filter === "all" || filter === "housing") && areas.map((area, index) => {
            const position = AREA_COORDINATES[area.area_name];
            if (!position) return null;
            
            // Assign colors based on rank
            let color = "#3b82f6"; // default blue
            if (area.rank === 1) color = "#10b981"; // emerald for top pick
            if (area.rank === 2) color = "#6366f1"; // indigo for second
            if (area.rank === 3) color = "#8b5cf6"; // violet for third

            return (
              <Marker
                key={area.area_name}
                position={position}
                onClick={() => setActiveMarker(area.area_name)}
                label={{
                  text: `${area.rank}`,
                  color: "white",
                  fontWeight: "bold",
                }}
                icon={{
                  path: typeof window !== 'undefined' ? window.google.maps.SymbolPath.CIRCLE : 0,
                  fillColor: color,
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#ffffff",
                  scale: 14,
                }}
              >
                {activeMarker === area.area_name && (
                  <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                    <div style={{ color: "#111" }} className="p-1">
                      <p className="font-bold mb-1 text-sm">{area.area_name}</p>
                      <p className="text-xs font-medium text-emerald-600 mb-0.5">
                        Score: {area.compatibility_score}/100
                      </p>
                      <p className="text-xs text-gray-600">
                        {area.one_way_commute_minutes} min commute
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            );
          })}

          {/* Food Markers */}
          {(filter === "all" || filter === "food") && areas.map((area) => 
            area.food_spots?.map((place, idx) => (
              <Marker
                key={`food-${area.area_name}-${idx}`}
                position={{ lat: place.location.latitude, lng: place.location.longitude }}
                onClick={() => setActiveMarker(`food-${area.area_name}-${idx}`)}
                icon={{
                  path: typeof window !== 'undefined' ? window.google.maps.SymbolPath.CIRCLE : 0,
                  fillColor: "#f43f5e", // Rose
                  fillOpacity: 0.8,
                  strokeWeight: 1,
                  strokeColor: "#ffffff",
                  scale: 8,
                }}
              >
                {activeMarker === `food-${area.area_name}-${idx}` && (
                  <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                    <div style={{ color: "#111" }} className="p-1 max-w-[200px]">
                      <p className="font-bold mb-1 text-sm">{place.name}</p>
                      <p className="text-xs text-amber-500 mb-1">⭐ {place.rating}</p>
                      {place.ai_insight && (
                        <p className="text-[10px] text-gray-600 italic">"{place.ai_insight}"</p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))
          )}

          {/* Fitness Markers */}
          {(filter === "all" || filter === "fitness") && areas.map((area) => 
            area.gym_options?.map((place, idx) => (
              <Marker
                key={`gym-${area.area_name}-${idx}`}
                position={{ lat: place.location.latitude, lng: place.location.longitude }}
                onClick={() => setActiveMarker(`gym-${area.area_name}-${idx}`)}
                icon={{
                  path: typeof window !== 'undefined' ? window.google.maps.SymbolPath.CIRCLE : 0,
                  fillColor: "#10b981", // Emerald
                  fillOpacity: 0.8,
                  strokeWeight: 1,
                  strokeColor: "#ffffff",
                  scale: 8,
                }}
              >
                {activeMarker === `gym-${area.area_name}-${idx}` && (
                  <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                    <div style={{ color: "#111" }} className="p-1 max-w-[200px]">
                      <p className="font-bold mb-1 text-sm">{place.name}</p>
                      <p className="text-xs text-amber-500 mb-1">⭐ {place.rating}</p>
                      {place.ai_insight && (
                        <p className="text-[10px] text-gray-600 italic">"{place.ai_insight}"</p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
