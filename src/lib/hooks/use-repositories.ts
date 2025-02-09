import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/auth-provider";

export interface Repository {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
  stars: number;
  language: string | null;
}

export function useRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;
    fetchRepositories();

    // Subscribe to changes
    const channel = supabase
      .channel("public:repositories")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "repositories",
        },
        () => {
          fetchRepositories();
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("repositories")
        .select(
          `
          *,
          comments:comments(count),
          pull_requests:pull_requests(count)
        `,
        )
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setRepositories(data);
    } catch (e) {
      console.error("Error fetching repositories:", e);
      setError(e instanceof Error ? e : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const createRepository = async ({
    name,
    description,
    isPrivate,
  }: {
    name: string;
    description?: string;
    isPrivate: boolean;
  }) => {
    try {
      const { data, error } = await supabase.from("repositories").insert([
        {
          name,
          description,
          is_private: isPrivate,
          owner_id: user?.id,
          language: null,
          stars: 0,
        },
      ]);

      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Error creating repository:", e);
      throw e;
    }
  };

  return {
    repositories,
    loading,
    error,
    createRepository,
    refetch: fetchRepositories,
  };
}
