"use client";

import dynamic from "next/dynamic";
import type Plotly from "plotly.js";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

function generateSurfaceData() {
  const size = 50;
  const x = Array.from({ length: size }, (_, i) => -5 + (10 * i) / (size - 1));
  const y = [...x];
  const z = y.map((yi) =>
    x.map((xi) => Math.sin(Math.sqrt(xi * xi + yi * yi)) * 3)
  );
  return { x, y, z };
}

function generate3DScatterData(n = 200) {
  const data = { x: [] as number[], y: [] as number[], z: [] as number[], colors: [] as number[] };
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 4;
    data.x.push(Math.cos(t) * (1 + t * 0.1) + (Math.random() - 0.5) * 0.5);
    data.y.push(Math.sin(t) * (1 + t * 0.1) + (Math.random() - 0.5) * 0.5);
    data.z.push(t * 0.3 + (Math.random() - 0.5) * 0.5);
    data.colors.push(t);
  }
  return data;
}

const surfaceData = generateSurfaceData();
const scatterData = generate3DScatterData();

const darkLayout = {
  paper_bgcolor: "#111111",
  plot_bgcolor: "#111111",
  font: { color: "#ededed", size: 11 },
  margin: { l: 0, r: 0, t: 40, b: 0 },
  scene: {
    xaxis: { gridcolor: "#262626", zerolinecolor: "#333", color: "#888" },
    yaxis: { gridcolor: "#262626", zerolinecolor: "#333", color: "#888" },
    zaxis: { gridcolor: "#262626", zerolinecolor: "#333", color: "#888" },
    bgcolor: "#0a0a0a",
  },
};

export function Charts3D() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-medium text-muted mb-4">
          3D Surface Plot — sin(√(x² + y²))
        </h3>
        <Plot
          data={[
            {
              type: "surface",
              x: surfaceData.x,
              y: surfaceData.y,
              z: surfaceData.z,
              colorscale: "Viridis",
              showscale: true,
              colorbar: { tickfont: { color: "#888" } },
            },
          ]}
          layout={{
            ...darkLayout,
            title: { text: "Mathematical Surface", font: { color: "#ededed", size: 14 } },
            autosize: true,
          }}
          config={{ responsive: true, displayModeBar: true }}
          className="w-full"
          style={{ height: 500 }}
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-medium text-muted mb-4">
          3D Scatter Plot — Spiral Helix
        </h3>
        <Plot
          data={[
            {
              type: "scatter3d",
              mode: "markers",
              x: scatterData.x,
              y: scatterData.y,
              z: scatterData.z,
              marker: {
                size: 3,
                color: scatterData.colors,
                colorscale: "Portland",
                opacity: 0.8,
                colorbar: { tickfont: { color: "#888" } },
              },
            },
          ]}
          layout={{
            ...darkLayout,
            title: { text: "Parametric Helix", font: { color: "#ededed", size: 14 } },
            autosize: true,
          }}
          config={{ responsive: true, displayModeBar: true }}
          className="w-full"
          style={{ height: 500 }}
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-5 xl:col-span-2">
        <h3 className="text-sm font-medium text-muted mb-4">
          3D Mesh — Parametric Torus
        </h3>
        <Plot
          data={[
            (() => {
              const R = 3, r = 1, n = 40;
              const x: number[] = [], y: number[] = [], z: number[] = [], intensity: number[] = [];
              for (let i = 0; i <= n; i++) {
                for (let j = 0; j <= n; j++) {
                  const u = (i / n) * 2 * Math.PI;
                  const v = (j / n) * 2 * Math.PI;
                  x.push((R + r * Math.cos(v)) * Math.cos(u));
                  y.push((R + r * Math.cos(v)) * Math.sin(u));
                  z.push(r * Math.sin(v));
                  intensity.push(Math.sin(u) * Math.cos(v));
                }
              }
              const ii: number[] = [], jj: number[] = [], kk: number[] = [];
              for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                  const a = i * (n + 1) + j;
                  const b = a + 1;
                  const c = a + (n + 1);
                  const d = c + 1;
                  ii.push(a, a);
                  jj.push(b, c);
                  kk.push(c, d);
                }
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return {
                type: "mesh3d" as const,
                x, y, z,
                i: new Int32Array(ii),
                j: new Int32Array(jj),
                k: new Int32Array(kk),
                intensity,
                colorscale: "Jet",
                opacity: 0.85,
                colorbar: { tickfont: { color: "#888" } },
              } as Plotly.Data;
            })(),
          ]}
          layout={{
            ...darkLayout,
            title: { text: "Parametric Torus Mesh", font: { color: "#ededed", size: 14 } },
            autosize: true,
          }}
          config={{ responsive: true, displayModeBar: true }}
          className="w-full"
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
}
