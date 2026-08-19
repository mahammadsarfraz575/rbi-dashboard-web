import React, { useState } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell
} from "recharts";
import data from "./data.json";

const { repoTimeline, cpiTrend, gdpForecast, eventStudy } = data;

const kpis = [
  { label: "Repo Rate", value: "5.25%", note: "held since Dec '25 cut · 4th straight hold", tone: "gold" },
  { label: "CPI Inflation", value: "4.45%", note: "Jul '26 · above 4% target midpoint", tone: "red" },
  { label: "GDP Growth (FY27 est.)", value: "6.7%", note: "raised from 6.6% at Aug '26 meet", tone: "teal" },
  { label: "Next MPC Meeting", value: "Oct 5–7", note: "2026 · 4th bi-monthly review of FY27", tone: "gold" },
];

const ripple = [
  { label: "Loans & EMIs", body: "Repo cuts lower banks' cost of funds, so floating-rate home/auto loan EMIs tend to fall within a quarter." },
  { label: "Deposits", body: "Fixed deposit rates move the same direction as repo — savers earn less when RBI cuts, more when it hikes." },
  { label: "Rupee & Forex", body: "Rate holds/hikes make INR assets more attractive to foreign investors, supporting the rupee; cuts can weaken it." },
  { label: "Markets", body: "Equity markets often rally on cuts (cheaper credit, higher growth) and get cautious on surprise hikes." },
];

const dotColor = { cut: "#6FA166", hike: "#C1483C", hold: "#C9A227" };

function RepoDot(props) {
  const { cx, cy, payload } = props;
  return <circle cx={cx} cy={cy} r={5} fill={dotColor[payload.action]} stroke="#0D1526" strokeWidth={2} />;
}

function CardShell({ children, style }) {
  return (
    <div style={{ background: "#16213A", border: "1px solid #24314F", borderRadius: 14, padding: "20px 22px", ...style }}>
      {children}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("repo");

  const repoBarData = eventStudy.repoEvents.map((e) => ({ ...e, label: e.date.slice(0, 7) }));
  const budgetBarData = eventStudy.budgetEvents.map((e) => ({ ...e, label: e.date.slice(0, 7) }));

  return (
    <div style={{ background: "#0D1526", minHeight: "100vh", padding: "36px 24px 60px", fontFamily: "'Inter', system-ui, sans-serif", color: "#EDE8DA" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .display { font-family: 'Fraunces', serif; }
        .tabbtn { transition: all .15s ease; cursor: pointer; }
        .tabbtn:hover { color: #EDE8DA !important; }
        body { margin: 0; }
      `}</style>

      <div style={{ maxWidth: 1080, margin: "0 auto 32px" }}>
        <div className="mono" style={{ fontSize: 12, letterSpacing: 2, color: "#C9A227", marginBottom: 10 }}>
          INDIA MACRO PULSE · OPEN DATA
        </div>
        <h1 className="display" style={{ fontSize: 40, fontWeight: 600, margin: 0, lineHeight: 1.15 }}>
          How RBI Moves India
        </h1>
        <p style={{ color: "#8B93A7", maxWidth: 620, marginTop: 10, fontSize: 15, lineHeight: 1.6 }}>
          A live-tracked view of the Reserve Bank of India's policy decisions and the data
          they move — repo rate, inflation, growth, and market reaction — built from public
          RBI, MoSPI, and government sources.
        </p>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {kpis.map((k) => (
          <CardShell key={k.label}>
            <div style={{ fontSize: 12, color: "#8B93A7", textTransform: "uppercase", letterSpacing: 1 }}>{k.label}</div>
            <div className="mono display" style={{ fontSize: 30, fontWeight: 600, marginTop: 8, color: "#EDE8DA" }}>{k.value}</div>
            <div style={{ fontSize: 12.5, color: k.tone === "red" ? "#D98A80" : k.tone === "teal" ? "#8FCAC3" : "#D9BE6A", marginTop: 6 }}>
              {k.note}
            </div>
          </CardShell>
        ))}
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto 14px", display: "flex", gap: 20, flexWrap: "wrap" }}>
        {[["repo", "Repo Rate Pulse"], ["cpi", "Inflation Trend"], ["gdp", "GDP Growth"], ["reaction", "Market Reaction"]].map(([id, label]) => (
          <div key={id} className="tabbtn" onClick={() => setTab(id)}
            style={{ fontSize: 14, fontWeight: 600, paddingBottom: 8, color: tab === id ? "#C9A227" : "#8B93A7", borderBottom: tab === id ? "2px solid #C9A227" : "2px solid transparent" }}>
            {label}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto 28px" }}>
        <CardShell style={{ height: 360 }}>
          {tab === "repo" && (
            <>
              <div style={{ fontSize: 13, color: "#8B93A7", marginBottom: 4 }}>
                MPC decisions, Feb 2025 – Aug 2026 · gold = hold, green = cut, red = hike
              </div>
              <ResponsiveContainer width="100%" height="88%">
                <LineChart data={repoTimeline} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#24314F" vertical={false} />
                  <XAxis dataKey="meet" tick={{ fill: "#8B93A7", fontSize: 12 }} axisLine={{ stroke: "#24314F" }} tickLine={false} />
                  <YAxis domain={[5, 6.75]} tick={{ fill: "#8B93A7", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ background: "#0D1526", border: "1px solid #24314F", borderRadius: 8, fontSize: 13 }} labelStyle={{ color: "#EDE8DA" }}
                    formatter={(v, n, p) => [`${v}% (${p.payload.action}${p.payload.bps ? ", " + p.payload.bps + "bps" : ""})`, "Repo rate"]} />
                  <Line type="stepAfter" dataKey="rate" stroke="#C9A227" strokeWidth={2} dot={<RepoDot />} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
          {tab === "cpi" && (
            <>
              <div style={{ fontSize: 13, color: "#8B93A7", marginBottom: 4 }}>
                CPI-based headline inflation (YoY %) · RBI's target band is 2–6%, midpoint 4%
              </div>
              <ResponsiveContainer width="100%" height="88%">
                <AreaChart data={cpiTrend} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cpiFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F9C93" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#4F9C93" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#24314F" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#8B93A7", fontSize: 12 }} axisLine={{ stroke: "#24314F" }} tickLine={false} />
                  <YAxis tick={{ fill: "#8B93A7", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                  <ReferenceLine y={4} stroke="#C9A227" strokeDasharray="4 4" label={{ value: "4% target", position: "insideTopRight", fill: "#C9A227", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0D1526", border: "1px solid #24314F", borderRadius: 8, fontSize: 13 }} labelStyle={{ color: "#EDE8DA" }} />
                  <Area type="monotone" dataKey="cpi" stroke="#4F9C93" strokeWidth={2} fill="url(#cpiFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
          {tab === "gdp" && (
            <>
              <div style={{ fontSize: 13, color: "#8B93A7", marginBottom: 4 }}>Real GDP growth, actual + RBI forecast (%)</div>
              <ResponsiveContainer width="100%" height="88%">
                <LineChart data={gdpForecast} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#24314F" vertical={false} />
                  <XAxis dataKey="period" tick={{ fill: "#8B93A7", fontSize: 11 }} axisLine={{ stroke: "#24314F" }} tickLine={false} />
                  <YAxis domain={[6, 8]} tick={{ fill: "#8B93A7", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ background: "#0D1526", border: "1px solid #24314F", borderRadius: 8, fontSize: 13 }} labelStyle={{ color: "#EDE8DA" }} />
                  <Line type="monotone" dataKey="gdp" stroke="#C9A227" strokeWidth={2} dot={{ fill: "#C9A227", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
          {tab === "reaction" && (
            <>
              <div style={{ fontSize: 13, color: "#8B93A7", marginBottom: 4 }}>
                Nifty 50 % move, 6-day window around each event · from your own pipeline run · baseline random-day mean ≈ {eventStudy.baseline.mean}%
              </div>
              <ResponsiveContainer width="100%" height="88%">
                <BarChart data={[...repoBarData, ...budgetBarData]} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#24314F" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#8B93A7", fontSize: 11 }} axisLine={{ stroke: "#24314F" }} tickLine={false} />
                  <YAxis tick={{ fill: "#8B93A7", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                  <ReferenceLine y={0} stroke="#24314F" />
                  <Tooltip contentStyle={{ background: "#0D1526", border: "1px solid #24314F", borderRadius: 8, fontSize: 13 }} labelStyle={{ color: "#EDE8DA" }} />
                  <Bar dataKey="pctMove" radius={[4, 4, 0, 0]}>
                    {[...repoBarData, ...budgetBarData].map((d, i) => (
                      <Cell key={i} fill={d.pctMove >= 0 ? "#6FA166" : "#C1483C"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </CardShell>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto 28px" }}>
        <div className="display" style={{ fontSize: 20, fontWeight: 600, marginBottom: 14 }}>
          How one rate decision ripples through the economy
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
          {ripple.map((r) => (
            <CardShell key={r.label}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#C9A227", marginBottom: 6 }}>{r.label}</div>
              <div style={{ fontSize: 13.5, color: "#B9C0D0", lineHeight: 1.55 }}>{r.body}</div>
            </CardShell>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <CardShell style={{ background: "#101B30" }}>
          <div style={{ fontSize: 12.5, color: "#8B93A7", lineHeight: 1.7 }}>
            <b style={{ color: "#B9C0D0" }}>Data sources:</b> RBI Database on Indian Economy (DBIE) for repo
            rate & policy history · MoSPI for CPI inflation · RBI Monetary Policy Reports for GDP forecasts ·
            World Bank Open Data & Yahoo Finance for cross-checks and market reaction. Market Reaction tab is
            generated by <code>model_event_study.py</code> from the companion data pipeline — re-run it and
            paste fresh numbers into <code>src/data.json</code> to update this site.
          </div>
        </CardShell>
      </div>
    </div>
  );
}
