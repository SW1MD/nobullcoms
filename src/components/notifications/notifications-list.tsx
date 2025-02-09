import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitPullRequest, MessageSquare, FileText } from "lucide-react";

interface Notification {
  id: string;
  type: "message" | "pr" | "file";
  title: string;
  description: string;
  time: string;
  user: {
    name: string;
    avatar: string;
  };
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "New Message",
    description: "John mentioned you in #general",
    time: "5m ago",
    user: {
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
  },
  {
    id: "2",
    type: "pr",
    title: "Pull Request Review",
    description: "Jane requested your review on PR #42",
    time: "15m ago",
    user: {
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
  },
];

export default function NotificationsList() {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-4 p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow"
          >
            <Avatar>
              <AvatarImage src={notification.user.avatar} />
              <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{notification.title}</span>
                <span className="text-xs text-gray-500">
                  {notification.time}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {notification.description}
              </p>
            </div>
            {notification.type === "message" && (
              <MessageSquare className="h-4 w-4 text-blue-500" />
            )}
            {notification.type === "pr" && (
              <GitPullRequest className="h-4 w-4 text-purple-500" />
            )}
            {notification.type === "file" && (
              <FileText className="h-4 w-4 text-green-500" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
