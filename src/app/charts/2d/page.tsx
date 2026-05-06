import { Charts2D } from "@/components/Charts2D";

export default function Charts2DPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">2D Charts</h1>
        <p className="text-sm text-muted">
          Responsive Chart.js visualizations with dark theme — line, bar, pie, and scatter charts.
        </p>
      </div>
      <Charts2D />
    </div>
  );
}
