import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Message } from "@/types/chat";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    async function fetchMessages() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    function setupSubscription() {
      channel = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages((current) => [...current, newMessage]);
          },
        )
        .subscribe();
    }

    fetchMessages();
    setupSubscription();

    return () => {
      channel?.unsubscribe();
    };
  }, []);

  async function sendMessage(content: string) {
    try {
      const newMessage = {
        content,
        user_id: "current-user", // Replace with actual user ID
        user_name: "John Doe", // Replace with actual user name
        user_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=current-user`,
      };

      const { error } = await supabase.from("messages").insert([newMessage]);

      if (error) throw error;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  }

  return { messages, loading, error, sendMessage };
}
