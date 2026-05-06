"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  Trash2,
} from "lucide-react";
import type { SceneObject } from "./WebGLChatScene";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SceneChatPanelProps {
  sceneObjects: SceneObject[];
  onSceneUpdate: (objects: SceneObject[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SceneChatPanel({
  sceneObjects,
  onSceneUpdate,
  isOpen,
  onToggle,
}: SceneChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/generate-scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          history: messages.slice(-10), // last 10 messages for context
          currentScene: sceneObjects,
        }),
      });

      if (!res.ok) throw new Error("Scene generation failed");

      const data = await res.json();

      if (data.objects && Array.isArray(data.objects)) {
        onSceneUpdate(data.objects);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.explanation ||
              `Created ${data.objects.length} object(s) in the scene.`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.explanation ||
              "Could not generate scene. Try a clearer description.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearScene = () => {
    onSceneUpdate([]);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Scene cleared." },
    ]);
  };

  // Collapsed toggle button
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-card/90 backdrop-blur border border-border text-sm text-muted hover:text-foreground transition-colors"
      >
        <PanelRightOpen size={16} />
        <span className="hidden sm:inline">Chat</span>
      </button>
    );
  }

  return (
    <div className="w-80 flex-shrink-0 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare size={16} className="text-accent" />
          3D Scene Chat
        </div>
        <div className="flex items-center gap-1">
          {sceneObjects.length > 0 && (
            <button
              onClick={handleClearScene}
              className="p-1.5 rounded-md text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Clear scene"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md text-muted hover:text-foreground transition-colors"
          >
            <PanelRightClose size={16} />
          </button>
        </div>
      </div>

      {/* Object count badge */}
      {sceneObjects.length > 0 && (
        <div className="px-4 py-2 border-b border-border text-xs text-muted">
          {sceneObjects.length} object{sceneObjects.length !== 1 ? "s" : ""} in
          scene
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted text-xs text-center px-4">
            <div className="space-y-2">
              <p className="text-sm">🎨 Describe 3D objects to create</p>
              <p className="opacity-60">
                Try: &quot;make red cube rotating around donut&quot;
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-xs leading-relaxed rounded-lg px-3 py-2 ${
              msg.role === "user"
                ? "bg-accent/20 text-foreground ml-4"
                : "bg-card-hover border border-border text-foreground mr-4"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card-hover border border-border rounded-lg px-3 py-2">
              <Loader2 className="animate-spin text-accent" size={14} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3 border-t border-border"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe 3D objects..."
          className="flex-1 bg-transparent border border-border rounded-lg px-3 py-2 text-xs placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2 rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
