import { useState } from "react";
import {
  MapPin, IndianRupee, Clock, Utensils, Volume2, Moon, X, Save,
} from "lucide-react";
import type { RecommendPayload } from "./InputForm";

interface Props {
  currentPayload: RecommendPayload;
  onClose: () => void;
  onRerun: (updated: RecommendPayload) => void;
}

const JOB_LOCATIONS = ["Kharadi", "Viman Nagar", "Hadapsar", "Hinjewadi", "Baner"];

export function EditProfilePanel({ currentPayload, onClose, onRerun }: Props) {
  const [form, setForm] = useState<RecommendPayload>({ ...currentPayload });

  const update = (key: keyof RecommendPayload, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateLifestyle = (key: string, value: any) =>
    setForm((prev) => ({
      ...prev,
      lifestyle_preferences: { ...prev.lifestyle_preferences, [key]: value },
    }));

  const handleRerun = () => {
    onClose();
    onRerun(form);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full z-50 overflow-y-auto"
        style={{
          width: "min(420px, 100vw)",
          background: "var(--bg-elevated)",
          borderLeft: "1px solid var(--border-default)",
          boxShadow: "-24px 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
          style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-default)" }}
        >
          <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
            Edit Profile & Re-run
          </h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Job Location */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
              <MapPin size={12} className="inline mr-1" /> Job Location
            </label>
            <div className="grid grid-cols-3 gap-2">
              {JOB_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => update("job_location", loc)}
                  className="px-2 py-2 text-xs font-medium rounded-xl transition-all"
                  style={{
                    background: form.job_location === loc ? "var(--gradient-primary)" : "var(--bg-input)",
                    color: form.job_location === loc ? "white" : "var(--text-secondary)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
              <IndianRupee size={12} className="inline mr-1" /> Monthly Salary
            </label>
            <input
              type="number"
              className="form-input w-full"
              value={form.monthly_salary}
              onChange={(e) => update("monthly_salary", parseInt(e.target.value) || 0)}
            />
          </div>

          {/* EMI */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
              <IndianRupee size={12} className="inline mr-1" /> EMI Commitments
            </label>
            <input
              type="number"
              className="form-input w-full"
              value={form.emi_commitments}
              onChange={(e) => update("emi_commitments", parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
              🎯 Goal Description
            </label>
            <input
              type="text"
              className="form-input w-full"
              value={form.goal_description}
              onChange={(e) => update("goal_description", e.target.value)}
            />
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
              <Clock size={12} className="inline mr-1" /> Goal Timeframe (months): {form.goal_timeframe_months}
            </label>
            <input
              type="range"
              min={1} max={120} step={1}
              value={form.goal_timeframe_months}
              onChange={(e) => update("goal_timeframe_months", parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Food Habit */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
              <Utensils size={12} className="inline mr-1" /> Food Habit
            </label>
            <div className="flex gap-2">
              {["home", "outside", "mixed"].map((h) => (
                <button
                  key={h}
                  onClick={() => updateLifestyle("food_habit", h)}
                  className="flex-1 py-2 text-xs font-medium rounded-xl transition-all capitalize"
                  style={{
                    background: form.lifestyle_preferences.food_habit === h ? "rgba(129,140,248,0.25)" : "var(--bg-input)",
                    color: form.lifestyle_preferences.food_habit === h ? "var(--accent-indigo)" : "var(--text-secondary)",
                    border: `1px solid ${form.lifestyle_preferences.food_habit === h ? "var(--accent-indigo)" : "var(--border-default)"}`,
                  }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Noise Tolerance */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
              <Volume2 size={12} className="inline mr-1" /> Noise Tolerance
            </label>
            <div className="flex gap-2">
              {["low", "medium", "high"].map((n) => (
                <button
                  key={n}
                  onClick={() => updateLifestyle("noise_tolerance", n)}
                  className="flex-1 py-2 text-xs font-medium rounded-xl transition-all capitalize"
                  style={{
                    background: form.lifestyle_preferences.noise_tolerance === n ? "rgba(129,140,248,0.25)" : "var(--bg-input)",
                    color: form.lifestyle_preferences.noise_tolerance === n ? "var(--accent-indigo)" : "var(--text-secondary)",
                    border: `1px solid ${form.lifestyle_preferences.noise_tolerance === n ? "var(--accent-indigo)" : "var(--border-default)"}`,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Commute Tolerance */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
              <Clock size={12} className="inline mr-1" /> Max Commute: {form.lifestyle_preferences.commute_tolerance_minutes} min
            </label>
            <input
              type="range"
              min={5} max={180} step={5}
              value={form.lifestyle_preferences.commute_tolerance_minutes}
              onChange={(e) => updateLifestyle("commute_tolerance_minutes", parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Sleep Schedule */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
              <Moon size={12} className="inline mr-1" /> Sleep Schedule (HH:MM-HH:MM)
            </label>
            <input
              type="text"
              className="form-input w-full"
              value={form.lifestyle_preferences.sleep_schedule}
              onChange={(e) => updateLifestyle("sleep_schedule", e.target.value)}
              placeholder="23:00-07:00"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 p-4"
          style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border-default)" }}
        >
          <button onClick={handleRerun} className="btn-primary w-full">
            <Save size={16} /> Re-run with New Profile
          </button>
          <button
            onClick={onClose}
            className="w-full mt-2 py-2 text-xs font-medium"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
