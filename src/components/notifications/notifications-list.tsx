import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { GitPullRequest, MessageSquare, Star, Check, File } from "lucide-react";
import { useNotifications } from "@/contexts/notification-context";
import { useNavigate } from "react-router-dom";

export default function NotificationsList() {
  const { notifications, loading, error, markAsRead, markAllAsRead } =
    useNotifications();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-sm text-red-500">
          Error loading notifications: {error.message}
        </p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "pr_created":
      case "pr_closed":
      case "pr_merged":
        return <GitPullRequest className="h-4 w-4 text-purple-500" />;
      case "comment_added":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "repository_starred":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "file_changed":
        return <File className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {notifications.some((n) => !n.read) && (
          <Button variant="outline" size="sm" onClick={() => markAllAsRead()}>
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow cursor-pointer ${!notification.read ? "bg-blue-50/50" : ""}`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                  if (notification.link) {
                    navigate(notification.link);
                  }
                }}
              >
                <div className="p-2 rounded-full bg-gray-100">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{notification.title}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {notification.description}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
