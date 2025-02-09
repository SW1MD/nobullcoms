import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

const messages: Message[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    content: "Hey everyone! How are you all doing?",
    timestamp: "12:00 PM",
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
    content: "Hi John! Doing great, thanks for asking!",
    timestamp: "12:01 PM",
  },
];

export default function MessageList() {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={message.user.avatar} />
              <AvatarFallback>{message.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{message.user.name}</span>
                <span className="text-xs text-gray-500">
                  {message.timestamp}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
