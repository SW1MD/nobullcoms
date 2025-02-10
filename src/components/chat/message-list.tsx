import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMessages } from "@/contexts/message-context";

export default function MessageList() {
  const navigate = useNavigate();
  const { messages, loading, loadingMore, error, hasMore, loadMoreMessages } =
    useMessages();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll on initial load or when new messages arrive
    if (scrollAreaRef.current && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, loading]);

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-sm text-red-500">
          Error loading messages: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea ref={scrollAreaRef} className="h-full" type="always">
        <div className="p-4 space-y-4">
          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadMoreMessages}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={message.id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className="flex items-start gap-3"
            >
              <Avatar>
                <AvatarImage src={message.user_avatar} />
                <AvatarFallback>{message.user_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="font-semibold hover:text-blue-500 cursor-pointer"
                    onClick={() => navigate(`/profile/${message.user_id}`)}
                  >
                    {message.user_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
