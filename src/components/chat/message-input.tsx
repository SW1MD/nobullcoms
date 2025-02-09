import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";

export default function MessageInput() {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Textarea
          placeholder="Message #general"
          className="min-h-[44px] max-h-[60vh]"
        />
        <Button size="icon" className="h-[44px]">
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
