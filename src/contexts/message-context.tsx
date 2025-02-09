import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Message } from "@/types/chat";

interface MessageContextType {
  messages: Message[];
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  sendMessage: (message: Omit<Message, "id" | "created_at">) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);
const MESSAGES_PER_PAGE = 100; // Number of messages to load per page

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = async (offset = 0) => {
    try {
      const { data, error, count } = await supabase
        .from("messages")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: true })
        .range(offset, offset + MESSAGES_PER_PAGE - 1);

      if (error) throw error;
      setHasMore((count || 0) > offset + MESSAGES_PER_PAGE);
      return data || [];
    } catch (e) {
      console.error("Error fetching messages:", e);
      setError(e as Error);
      return [];
    }
  };

  useEffect(() => {
    const loadInitialMessages = async () => {
      setLoading(true);
      try {
        const initialMessages = await fetchMessages();
        setMessages(initialMessages);
      } catch (e) {
        console.error("Error loading initial messages:", e);
      } finally {
        setLoading(false);
      }
    };

    loadInitialMessages();

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((current) => [...current, newMessage]);
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadMoreMessages = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const olderMessages = await fetchMessages(messages.length);
      setMessages((current) => [...current, ...olderMessages]);
    } finally {
      setLoadingMore(false);
    }
  };

  const sendMessage = async (message: Omit<Message, "id" | "created_at">) => {
    try {
      const { error } = await supabase.from("messages").insert([message]);
      if (error) throw error;
    } catch (e) {
      console.error("Error sending message:", e);
      setError(e as Error);
      throw e;
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        loadingMore,
        error,
        hasMore,
        sendMessage,
        loadMoreMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
}
