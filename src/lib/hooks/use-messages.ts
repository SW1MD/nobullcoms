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

  const sendMessage = async (message: Omit<Message, "id" | "created_at">) => {
    try {
      const { error } = await supabase.from("messages").insert([message]);
      if (error) throw error;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  return { messages, loading, error, sendMessage };
}
