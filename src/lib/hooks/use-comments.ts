import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Comment {
  id: string;
  repository_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
}

export function useComments(repositoryId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchComments();

    // Subscribe to new comments
    const channel = supabase
      .channel(`public:comments:${repositoryId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `repository_id=eq.${repositoryId}`,
        },
        () => {
          fetchComments();
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [repositoryId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("repository_id", repositoryId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (e) {
      console.error("Error fetching comments:", e);
      setError(e instanceof Error ? e : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const addComment = async ({
    content,
    user_id,
    user_name,
    user_avatar,
  }: {
    content: string;
    user_id: string;
    user_name: string;
    user_avatar?: string;
  }) => {
    try {
      // First get repository info
      const { data: repo, error: repoError } = await supabase
        .from("repositories")
        .select("owner_id, name")
        .eq("id", repositoryId)
        .single();

      if (repoError) throw repoError;
      if (!repo) throw new Error("Repository not found");

      // Insert comment
      const { error: commentError } = await supabase.from("comments").insert({
        repository_id: repositoryId,
        content,
        user_id,
        user_name,
        user_avatar,
      });

      if (commentError) throw commentError;

      // Create notification for repository owner
      if (repo.owner_id && repo.owner_id !== user_id) {
        const { error: notificationError } = await supabase
          .from("notifications")
          .insert({
            user_id: repo.owner_id,
            type: "comment_added",
            title: "New comment",
            description: `${user_name} commented on repository ${repo.name}`,
            link: `/repositories/${repositoryId}`,
            read: false,
            created_at: new Date().toISOString(),
          });

        if (notificationError) {
          console.error("Error creating notification:", notificationError);
          throw notificationError;
        }
      }

      await fetchComments();
    } catch (e) {
      console.error("Error adding comment:", e);
      throw e;
    }
  };

  return {
    comments,
    loading,
    error,
    addComment,
  };
}
