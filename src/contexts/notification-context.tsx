import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/auth-provider";

export interface Notification {
  id: string;
  type:
    | "pr_created"
    | "pr_closed"
    | "pr_merged"
    | "comment_added"
    | "repository_starred"
    | "file_changed";
  title: string;
  description: string;
  link: string;
  read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel(`public:notifications:user_id=eq.${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (e) {
      console.error("Error fetching notifications:", e);
      setError(e instanceof Error ? e : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) throw error;
      setNotifications((current) =>
        current.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (e) {
      console.error("Error marking notification as read:", e);
      throw e;
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user?.id);

      if (error) throw error;
      setNotifications((current) => current.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error("Error marking all notifications as read:", e);
      throw e;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        loading,
        error,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
