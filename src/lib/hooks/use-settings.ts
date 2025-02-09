import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/auth-provider";

interface UserSettings {
  id: string;
  avatar_url: string | null;
  theme: string;
  compact_mode: boolean;
  visible_pages: string[];
  notifications_enabled: boolean;
  notification_sounds: boolean;
  created_at: string;
  updated_at: string;
}

export function useSettings() {
  const { user } = useAuthContext();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`public:user_settings:id=eq.${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_settings",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setSettings(payload.new as UserSettings);
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_settings")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      await updateSettings({ avatar_url: data.publicUrl });
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    uploadAvatar,
  };
}
