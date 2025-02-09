import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calculator, Calendar, Clock, Terminal } from "lucide-react";

const tools = [
  {
    id: "1",
    name: "Calculator",
    description: "Basic and scientific calculations",
    icon: Calculator,
  },
  {
    id: "2",
    name: "Calendar",
    description: "Schedule and manage events",
    icon: Calendar,
  },
  {
    id: "3",
    name: "Time Tracker",
    description: "Track time spent on tasks",
    icon: Clock,
  },
  {
    id: "4",
    name: "Terminal",
    description: "Command line interface",
    icon: Terminal,
  },
];

export default function ToolsList() {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{tool.name}</h3>
              </div>
              <p className="text-sm text-gray-500">{tool.description}</p>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
