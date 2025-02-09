import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { useMessages } from "@/lib/hooks/use-messages";
import { useAuthContext } from "@/components/auth/auth-provider";
import { useSettings } from "@/lib/hooks/use-settings";

export default function MessageInput() {
  const [content, setContent] = useState("");
  const { sendMessage } = useMessages();
  const [sending, setSending] = useState(false);
  const { user } = useAuthContext();
  const { settings } = useSettings();

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;

    try {
      setSending(true);
      await sendMessage({
        content,
        user_id: user.id,
        user_name:
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Anonymous",
        user_avatar:
          settings?.avatar_url ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      });
      setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="min-h-[44px] max-h-[60vh]"
          disabled={sending}
        />
        <Button
          size="icon"
          className="h-[44px]"
          onClick={handleSubmit}
          disabled={sending || !content.trim()}
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
