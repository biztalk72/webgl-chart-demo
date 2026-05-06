import { Charts3D } from "@/components/Charts3D";

export default function Charts3DPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">3D Charts</h1>
        <p className="text-sm text-muted">
          Interactive 3D visualizations with Plotly.js — surface plots, scatter plots, and parametric meshes.
          Drag to rotate, scroll to zoom.
        </p>
      </div>
      <Charts3D />
    </div>
  );
}
