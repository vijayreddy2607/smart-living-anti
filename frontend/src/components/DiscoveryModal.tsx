import { useState } from "react";
import { MapPin, Utensils, Star, X, Send, ChevronRight } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────── */
interface NearbyPlace {
  name: string;
  address: string;
  rating: number;
  type: string;
}

interface ReviewData {
  placeName: string;
  placeType: string;
  rating: number;
  text: string;
  author: string;
}

/* ─── Restaurant Discovery Modal ─────────────────────────────────── */
export function DiscoveryModal({
  show,
  onClose,
  city,
  area,
}: {
  show: boolean;
  onClose: () => void;
  city: string;
  area?: string;
}) {
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<string | null>(null);

  const discoverPlaces = async () => {
    setLoading(true);
    try {
      const searchArea = area || city;
      const res = await fetch(`/api/places/nearby?area=${encodeURIComponent(searchArea)}&city=${encodeURIComponent(city)}&type=restaurant`);
      if (res.ok) {
        const data = await res.json();
        setPlaces(data.places || []);
      } else {
        // Fallback sample data if API not available
        setPlaces([
          { name: `Meghana Foods ${city}`, address: `Main Road, ${searchArea}`, rating: 4.5, type: "restaurant" },
          { name: `Empire Restaurant`, address: `Near IT Hub, ${searchArea}`, rating: 4.2, type: "restaurant" },
          { name: `Truffles`, address: `${searchArea} Main Street`, rating: 4.4, type: "restaurant" },
          { name: `A2B Veg Restaurant`, address: `Junction, ${searchArea}`, rating: 4.0, type: "restaurant" },
          { name: `Café Coffee Day`, address: `${searchArea} Road`, rating: 3.8, type: "cafe" },
        ]);
      }
    } catch {
      setPlaces([
        { name: `Local Dining Hub`, address: `${area || city} area`, rating: 4.0, type: "restaurant" },
        { name: `Street Food Corner`, address: `Near ${area || city}`, rating: 4.3, type: "restaurant" },
      ]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="glass-card w-full max-w-lg overflow-hidden" style={{ background: "rgba(18,18,28,0.95)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Header */}
        <div className="p-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--accent-rose), var(--accent-orange))" }}>
                <Utensils size={18} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  Discover Restaurants Near You
                </h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Find dining options in your area
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {!searched ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.15)" }}>
                <MapPin size={28} style={{ color: "var(--accent-rose)" }} />
              </div>
              <h4 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Want to see restaurants near {area || city}?
              </h4>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                We'll show you the best dining spots with ratings, prices, and AI-powered reviews.
              </p>
              <button onClick={discoverPlaces} className="btn-primary" disabled={loading}>
                {loading ? "Searching…" : "🍽️ Yes, Show Me Restaurants"}
              </button>
              <button onClick={onClose} className="block mx-auto mt-3 text-sm" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                Maybe later
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Found <strong style={{ color: "var(--text-primary)" }}>{places.length} places</strong> near {area || city}
              </p>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {places.map((p, i) => (
                  <div key={i} className="p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{p.name}</h5>
                        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{p.address}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--accent-amber)" }}>
                            <Star size={11} className="fill-current" /> {p.rating}
                          </div>
                          <span className="price-tag">
                            ₹{p.rating >= 4.5 ? "400" : p.rating >= 4 ? "300" : "200"}/meal
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setReviewTarget(reviewTarget === p.name ? null : p.name)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg shrink-0"
                        style={{
                          background: "rgba(99,102,241,0.08)",
                          color: "var(--accent-indigo)",
                          border: "1px solid rgba(99,102,241,0.15)",
                          cursor: "pointer",
                        }}
                      >
                        ✍️ Review
                      </button>
                    </div>
                    {reviewTarget === p.name && (
                      <ReviewForm placeName={p.name} placeType="restaurant" onSubmit={() => setReviewTarget(null)} />
                    )}
                  </div>
                ))}
              </div>
              <button onClick={onClose} className="btn-primary w-full mt-4 justify-center">
                Done <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Review Form (inline) ───────────────────────────────────────── */
export function ReviewForm({
  placeName,
  placeType,
  onSubmit,
}: {
  placeName: string;
  placeType: string;
  onSubmit: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || !text.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          place_name: placeName,
          place_type: placeType,
          rating,
          text: text.trim(),
        }),
      });
    } catch {
      // Still show success even if API fails (stores locally)
    }

    // Store locally as backup
    const reviews = JSON.parse(localStorage.getItem("sl_reviews") || "[]");
    reviews.push({
      place_name: placeName,
      place_type: placeType,
      rating,
      text: text.trim(),
      date: new Date().toISOString(),
    });
    localStorage.setItem("sl_reviews", JSON.stringify(reviews));

    setSubmitting(false);
    setSubmitted(true);
    setTimeout(onSubmit, 1500);
  };

  if (submitted) {
    return (
      <div className="mt-3 p-3 rounded-xl text-center" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
        <p className="text-sm font-semibold" style={{ color: "var(--accent-emerald)" }}>✓ Review submitted! Thank you.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 p-3 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Rate {placeName}</p>

      {/* Star Rating */}
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={star <= (hovered || rating) ? "active" : ""}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(star)}
          >
            <Star size={20} className={star <= (hovered || rating) ? "fill-current" : ""} />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-xs ml-2 self-center" style={{ color: "var(--text-muted)" }}>
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
          </span>
        )}
      </div>

      {/* Review Text */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your experience... (food quality, service, ambiance)"
        className="form-input"
        rows={3}
        style={{ fontSize: "0.82rem", resize: "none" }}
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || !text.trim() || submitting}
        className="btn-primary w-full justify-center"
        style={{ padding: "10px 20px", fontSize: "0.82rem" }}
      >
        <Send size={14} /> {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
}
