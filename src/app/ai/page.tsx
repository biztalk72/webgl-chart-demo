import { ChatInterface } from "@/components/ChatInterface";

export default function AIPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">AI Chat & Vision</h1>
        <p className="text-sm text-muted">
          Interact with your local multimodal LLM — chat, analyze images, or generate charts from natural language.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
