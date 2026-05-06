"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { ZoomIn, ZoomOut, Globe, MessageSquare, X, Loader2, RotateCcw } from "lucide-react";
import type { HeatmapLayer, CountryData } from "@/components/GlobeScene";

const GlobeScene = dynamic(
  () => import("@/components/GlobeScene").then((m) => ({ default: m.GlobeScene })),
  { ssr: false, loading: () => <GlobePlaceholder /> }
);

type CountryInfo = {
  name: string;
  iso: string;
  population?: number;
  temperature?: number;
  literacy?: number;
  language?: string;
  region?: string;
  coords: [number, number];
};

const LAYERS: { id: HeatmapLayer; label: string; unit: string }[] = [
  { id: "population", label: "Population", unit: "people" },
  { id: "temperature", label: "Temperature", unit: "°C" },
  { id: "education", label: "Education", unit: "literacy %" },
  { id: "language", label: "Language", unit: "language family" },
];

const LAYER_LEGEND: Record<HeatmapLayer, { low: string; high: string; lowColor: string; highColor: string }> = {
  population: { low: "Low", high: "High", lowColor: "#3b5bdb", highColor: "#c92a2a" },
  temperature: { low: "Cold", high: "Hot", lowColor: "#228be6", highColor: "#e03131" },
  education: { low: "Low literacy", high: "High literacy", lowColor: "#2f9e44", highColor: "#94d82d" },
  language: { low: "Diverse", high: "", lowColor: "#7048e8", highColor: "#f76707" },
};

export default function GlobePage() {
  const [layer, setLayer] = useState<HeatmapLayer>("population");
  const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [loadingLayer, setLoadingLayer] = useState(false);
  const [zoomTrigger, setZoomTrigger] = useState<{ iso: string; coords: [number, number] } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(250);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Load GeoJSON once
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson")
      .then((r) => r.json())
      .then(setGeoJson)
      .catch(() => {
        // fallback to unpkg
        fetch("https://unpkg.com/world-atlas@2/countries-110m.json").catch(() => null);
      });
  }, []);

  // Load layer data
  useEffect(() => {
    setLoadingLayer(true);
    fetch(`/api/globe/${layer}`)
      .then((r) => r.json())
      .then((data: CountryData[]) => setCountryData(data))
      .catch(() => setCountryData([]))
      .finally(() => setLoadingLayer(false));
  }, [layer]);

  const handleCountryClick = useCallback(
    (feature: GeoJSON.Feature) => {
      const props = feature.properties ?? {};
      const iso = (props.ISO_A2 || props.iso_a2 || "").toUpperCase();
      const entry = countryData.find((c) => c.iso.toUpperCase() === iso);
      const centroid = getFeatureCentroid(feature);
      const countryName = props.NAME || props.name || iso;

      setSelectedCountry({
        name: countryName,
        iso,
        population: entry?.extra?.population as number | undefined,
        temperature: entry?.extra?.temperature as number | undefined,
        literacy: entry?.extra?.literacy as number | undefined,
        language: entry?.extra?.language as string | undefined,
        region: props.REGION_WB || props.region || props.CONTINENT || "",
        coords: centroid,
      });

      if (centroid) setZoomTrigger({ iso, coords: centroid });

      // AI insight: auto-open chat and fetch insight for clicked country
      setChatOpen(true);
      setChatLoading(true);
      fetch("/api/globe/ai-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `Give me a brief insight about ${countryName} for the current ${layer} data layer.`,
          currentLayer: layer,
          selectedCountry: countryName,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          setChatMessages((prev) => [
            ...prev,
            { role: "ai", text: `📍 ${countryName}: ${data.reply}` },
          ]);
        })
        .catch(() => {
          setChatMessages((prev) => [
            ...prev,
            { role: "ai", text: `📍 ${countryName} selected. (AI unavailable)` },
          ]);
        })
        .finally(() => setChatLoading(false));
    },
    [countryData, layer]
  );

  const handleZoomIn = useCallback(() => setZoomLevel((z) => Math.max(130, z - 40)), []);
  const handleZoomOut = useCallback(() => setZoomLevel((z) => Math.min(500, z + 40)), []);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: msg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/globe/ai-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: msg, currentLayer: layer, selectedCountry: selectedCountry?.name }),
      });
      const data = await res.json();
      if (data.layer && data.layer !== layer) setLayer(data.layer);
      setChatMessages((prev) => [...prev, { role: "ai", text: data.reply || "Done." }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: "ai", text: "Sorry, AI is unavailable." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const legend = LAYER_LEGEND[layer];

  return (
    <div className="flex h-full relative bg-background overflow-hidden">
      {/* Globe canvas */}
      <div className="flex-1 relative">
        <GlobeScene
          layer={layer}
          countryData={countryData}
          geoJson={geoJson}
          onCountryClick={handleCountryClick}
          zoomLevel={zoomLevel}
          zoomTrigger={zoomTrigger}
        />

        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={18} className="text-accent" />
              <h1 className="text-base font-semibold">Global Heatmap</h1>
              {loadingLayer && <Loader2 size={14} className="animate-spin text-muted" />}
            </div>
            {/* Layer switcher */}
            <div className="flex gap-1.5 flex-wrap">
              {LAYERS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setLayer(id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    layer === id
                      ? "bg-accent text-white border-accent"
                      : "bg-card/80 text-muted border-border hover:text-foreground hover:bg-card"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom + Chat controls */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            <button onClick={handleZoomIn} className="p-2 bg-card/80 border border-border rounded-lg hover:bg-card transition-colors" title="Zoom in">
              <ZoomIn size={16} />
            </button>
            <button onClick={handleZoomOut} className="p-2 bg-card/80 border border-border rounded-lg hover:bg-card transition-colors" title="Zoom out">
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => setZoomTrigger(null)}
              className="p-2 bg-card/80 border border-border rounded-lg hover:bg-card transition-colors"
              title="Reset view"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => setChatOpen((o) => !o)}
              className={`p-2 rounded-lg border transition-colors ${chatOpen ? "bg-accent text-white border-accent" : "bg-card/80 border-border hover:bg-card"}`}
              title="AI Assistant"
            >
              <MessageSquare size={16} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <div className="bg-card/80 border border-border rounded-lg px-3 py-2 text-xs">
            <div className="text-muted mb-1.5 font-medium uppercase tracking-wider">
              {LAYERS.find((l) => l.id === layer)?.label}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted">{legend.low}</span>
              <div
                className="h-2 w-24 rounded-full"
                style={{ background: `linear-gradient(to right, ${legend.lowColor}, ${legend.highColor})` }}
              />
              <span className="text-muted">{legend.high}</span>
            </div>
          </div>
        </div>

        {/* Country tooltip */}
        {selectedCountry && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
            <div className="bg-card border border-border rounded-xl p-4 min-w-56 shadow-xl">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-semibold text-sm">{selectedCountry.name}</div>
                  <div className="text-xs text-muted">{selectedCountry.region}</div>
                </div>
                <button onClick={() => setSelectedCountry(null)} className="text-muted hover:text-foreground">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-1.5 text-xs">
                {selectedCountry.population != null && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Population</span>
                    <span className="font-medium">{formatPopulation(selectedCountry.population)}</span>
                  </div>
                )}
                {selectedCountry.temperature != null && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Avg Temp</span>
                    <span className="font-medium">{selectedCountry.temperature.toFixed(1)}°C</span>
                  </div>
                )}
                {selectedCountry.literacy != null && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Literacy</span>
                    <span className="font-medium">{selectedCountry.literacy.toFixed(1)}%</span>
                  </div>
                )}
                {selectedCountry.language && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Language</span>
                    <span className="font-medium">{selectedCountry.language}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Chat panel */}
      {chatOpen && (
        <div className="w-72 border-l border-border bg-card flex flex-col">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-accent" />
              <span className="text-sm font-medium">AI Globe Assistant</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-muted hover:text-foreground">
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {chatMessages.length === 0 && (
              <p className="text-muted text-center py-4">
                Ask about the globe — e.g.<br />
                &ldquo;Show temperature in Asia&rdquo;<br />
                &ldquo;Which countries have highest literacy?&rdquo;
              </p>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} className={`rounded-lg p-2.5 ${m.role === "user" ? "bg-accent/15 text-accent ml-4" : "bg-background text-foreground mr-4"}`}>
                {m.text}
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-muted">
                <Loader2 size={12} className="animate-spin" />
                <span>Thinking…</span>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleChatSubmit()}
                placeholder="Ask about the globe…"
                className="flex-1 text-xs bg-background border border-border rounded-lg px-2.5 py-2 outline-none focus:border-accent"
              />
              <button
                onClick={handleChatSubmit}
                disabled={chatLoading || !chatInput.trim()}
                className="px-2.5 py-2 bg-accent text-white rounded-lg text-xs disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GlobePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted">
        <Loader2 size={32} className="animate-spin text-accent" />
        <span className="text-sm">Loading globe…</span>
      </div>
    </div>
  );
}

function getFeatureCentroid(feature: GeoJSON.Feature): [number, number] {
  try {
    const geom = feature.geometry;
    let lngs: number[] = [], lats: number[] = [];
    const collect = (ring: GeoJSON.Position[]) => {
      ring.forEach(([lng, lat]) => { lngs.push(lng); lats.push(lat); });
    };
    if (geom.type === "Polygon") geom.coordinates.forEach(collect);
    else if (geom.type === "MultiPolygon") geom.coordinates.forEach((p) => p.forEach(collect));
    if (!lngs.length) return [0, 0];
    return [
      lats.reduce((a, b) => a + b) / lats.length,
      lngs.reduce((a, b) => a + b) / lngs.length,
    ];
  } catch {
    return [0, 0];
  }
}

function formatPopulation(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}
