"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Box,
  BarChart3,
  Globe,
  Globe2,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/webgl", label: "WebGL 3D", icon: Box },
  { href: "/charts/2d", label: "2D Charts", icon: BarChart3 },
  { href: "/charts/3d", label: "3D Charts", icon: Globe },
  { href: "/globe", label: "Global Heatmap", icon: Globe2 },
  { href: "/ai", label: "AI Chat", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-card border-r border-border flex flex-col z-50">
      <div className="p-5 border-b border-border">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-accent">WebGL</span> &amp; Charts
        </h1>
        <p className="text-xs text-muted mt-1">Local Multimodal LLM Demo</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-accent/15 text-accent font-medium"
                  : "text-muted hover:text-foreground hover:bg-card-hover"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted">Ollama connected</span>
        </div>
      </div>
    </aside>
  );
}
