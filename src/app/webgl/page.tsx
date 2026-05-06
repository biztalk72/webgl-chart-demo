"use client";

import { useState } from "react";
import { WebGLChatScene } from "@/components/WebGLChatScene";
import { SceneChatPanel } from "@/components/SceneChatPanel";
import type { SceneObject } from "@/components/WebGLChatScene";

export default function WebGLPage() {
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">WebGL 3D Scene</h1>
        <p className="text-sm text-muted">
          Chat to create 3D objects — describe what you want and watch it appear.
          Drag to orbit, scroll to zoom.
        </p>
      </div>
      <div className="relative flex gap-4 h-[calc(100vh-12rem)]">
        <div className="flex-1 min-w-0">
          <WebGLChatScene objects={sceneObjects} />
          {!chatOpen && (
            <SceneChatPanel
              sceneObjects={sceneObjects}
              onSceneUpdate={setSceneObjects}
              isOpen={false}
              onToggle={() => setChatOpen(true)}
            />
          )}
        </div>
        {chatOpen && (
          <SceneChatPanel
            sceneObjects={sceneObjects}
            onSceneUpdate={setSceneObjects}
            isOpen={true}
            onToggle={() => setChatOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
