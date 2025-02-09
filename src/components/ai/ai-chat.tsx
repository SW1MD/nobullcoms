import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Send } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

const messages: Message[] = [
  {
    id: "1",
    type: "ai",
    content: "Hello! How can I help you today?",
    timestamp: "12:00 PM",
  },
  {
    id: "2",
    type: "user",
    content: "Can you help me with git commands?",
    timestamp: "12:01 PM",
  },
  {
    id: "3",
    type: "ai",
    content: "Of course! What would you like to know about git?",
    timestamp: "12:01 PM",
  },
];

export default function AIChat() {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`p-2 rounded-full ${message.type === "ai" ? "bg-primary/10" : "bg-blue-500/10"}`}
              >
                {message.type === "ai" ? (
                  <Bot className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <div
                className={`flex flex-col ${message.type === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3 rounded-lg ${message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input placeholder="Ask anything..." className="flex-1" />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
