import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Play, Save, Download } from "lucide-react";

export default function CodeEditor() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
        <Button size="sm">
          <Play className="h-4 w-4 mr-2" />
          Run
        </Button>
      </div>
      <ScrollArea className="flex-1 bg-[#1E1E1E] text-white p-4">
        <pre className="font-mono text-sm">
          <code>{`// Your code here
function example() {
  console.log("Hello, World!");
}

example();`}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}
