import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import { TrendingUp, Target } from "lucide-react";

interface AreaSavings {
  area_name: string;
  projected_monthly_savings: number;
  rank: number;
}

interface Props {
  areas: AreaSavings[];
  goalAmount: number;
  goalMonths: number;
}

const COLORS = ["#818cf8", "#a78bfa", "#c4b5fd"]; // indigo → violet
const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Custom Tooltip
function CustomTooltip({ active, payload, goalAmount, goalMonths }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const savings = d.projected_monthly_savings ?? 0;
  const surplus = savings - goalAmount;
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs shadow-xl"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}
    >
      <p className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>{d.area_name}</p>
      <p style={{ color: "var(--accent-indigo)" }}>
        Saves: <strong>{fmt(savings)}/mo</strong>
      </p>
      <p style={{ color: surplus >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
        {surplus >= 0 ? `+${fmt(surplus)} above goal` : `${fmt(Math.abs(surplus))} short`}
      </p>
      <p style={{ color: "var(--text-muted)" }}>
        Goal achieved in: {Math.ceil(goalAmount * goalMonths / Math.max(d.projected_monthly_savings, 1))} months
      </p>
    </div>
  );
}

export function SavingsChart({ areas, goalAmount, goalMonths }: Props) {
  const data = areas.map((a) => ({
    area_name: a.area_name,
    projected_monthly_savings: a.projected_monthly_savings,
    rank: a.rank,
  }));

  // Milestones: 25%, 50%, 75% of total goal
  const totalGoal = goalAmount * goalMonths;
  const milestones = [0.25, 0.5, 0.75, 1].map((pct) => ({
    month: Math.ceil(pct * goalMonths),
    saved: Math.round(pct * totalGoal),
    pct,
  }));

  return (
    <div className="glass-card p-6 fade-in-up">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp size={20} style={{ color: "var(--accent-indigo)" }} />
        <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
          Savings Comparison
        </h3>
      </div>
      <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
        Monthly projected savings per area vs your goal of {fmt(goalAmount)}/month
      </p>

      {/* Bar Chart */}
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="area_name"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip goalAmount={goalAmount} goalMonths={goalMonths} />} />
            <ReferenceLine
              y={goalAmount}
              stroke="var(--accent-amber)"
              strokeDasharray="4 4"
              label={{
                value: `Goal: ${fmt(goalAmount)}`,
                position: "insideTopRight",
                fill: "var(--accent-amber)",
                fontSize: 10,
              }}
            />
            <Bar dataKey="projected_monthly_savings" radius={[6, 6, 0, 0]} maxBarSize={80}>
              <LabelList
                dataKey="projected_monthly_savings"
                position="top"
                formatter={(v: number) => fmt(v)}
                style={{ fontSize: 10, fill: "var(--text-secondary)" }}
              />
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Milestones */}
      <div className="mt-5">
        <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
          <Target size={13} /> Goal Milestones — {fmt(totalGoal)} total in {goalMonths} months
        </p>
        <div className="flex gap-2 flex-wrap">
          {milestones.map((m) => (
            <div
              key={m.pct}
              className="flex-1 min-w-[60px] p-2 rounded-xl text-center"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)" }}
            >
              <p className="text-[10px] font-bold" style={{ color: "var(--accent-indigo)" }}>
                {Math.round(m.pct * 100)}%
              </p>
              <p className="text-[10px] font-semibold text-white">Month {m.month}</p>
              <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>{fmt(m.saved)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
