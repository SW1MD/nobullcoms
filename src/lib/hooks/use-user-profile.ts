import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  company: string | null;
  location: string | null;
  website: string | null;
}

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user metadata from auth.users
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();
        if (authError) throw authError;

        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        // If viewing own profile, use session data
        if (session?.user.id === userId) {
          const user = session.user;
          setProfile({
            id: user.id,
            email: user.email!,
            display_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url,
            company: profileData?.company || null,
            location: profileData?.location || null,
            website: profileData?.website || null,
          });
        }
        // If viewing other profile, use profile data
        else if (profileData) {
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch profile"),
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return { profile, loading, error };
}
