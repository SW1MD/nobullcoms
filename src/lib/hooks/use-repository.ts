import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/auth-provider";
import { Repository } from "./use-repositories";

export interface RepositoryFile {
  id: string;
  repository_id: string;
  path: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export function useRepository(id: string) {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [files, setFiles] = useState<RepositoryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user || !id) return;
    fetchRepository();
    fetchFiles();

    // Subscribe to repository changes
    const repoChannel = supabase
      .channel(`public:repositories:${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "repositories",
          filter: `id=eq.${id}`,
        },
        () => {
          fetchRepository();
        },
      )
      .subscribe();

    // Subscribe to file changes
    const filesChannel = supabase
      .channel(`public:repository_files:${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "repository_files",
          filter: `repository_id=eq.${id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setFiles((current) => [...current, payload.new as RepositoryFile]);
          } else if (payload.eventType === "DELETE") {
            setFiles((current) =>
              current.filter((f) => f.id !== payload.old.id),
            );
          } else if (payload.eventType === "UPDATE") {
            setFiles((current) =>
              current.map((f) =>
                f.id === payload.new.id ? (payload.new as RepositoryFile) : f,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      repoChannel.unsubscribe();
      filesChannel.unsubscribe();
    };
  }, [user, id]);

  const fetchRepository = async () => {
    try {
      const { data, error } = await supabase
        .from("repositories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setRepository(data);
    } catch (e) {
      console.error("Error fetching repository:", e);
      setError(e instanceof Error ? e : new Error("An error occurred"));
    }
  };

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from("repository_files")
        .select("*")
        .eq("repository_id", id)
        .order("path");

      if (error) throw error;
      setFiles(data);
    } catch (e) {
      console.error("Error fetching files:", e);
      setError(e instanceof Error ? e : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const notifyFileChange = async (action: string, filename: string) => {
    try {
      const { data: repo } = await supabase
        .from("repositories")
        .select("owner_id")
        .eq("id", id)
        .single();

      if (repo?.owner_id) {
        await supabase.from("notifications").insert([
          {
            user_id: repo.owner_id,
            type: "file_changed",
            title: `File ${action}`,
            description: `The file ${filename} was ${action} in repository ${repository?.name}`,
            link: `/repositories/${id}`,
            read: false,
          },
        ]);
      }
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  const createFile = async ({
    path,
    content,
  }: {
    path: string;
    content: string;
  }) => {
    try {
      const { data, error } = await supabase.from("repository_files").insert([
        {
          repository_id: id,
          path,
          content,
        },
      ]);

      if (error) throw error;
      await notifyFileChange("created", path);
      return data;
    } catch (e) {
      console.error("Error creating file:", e);
      throw e;
    }
  };

  const updateFile = async (
    fileId: string,
    { path, content }: { path?: string; content?: string },
  ) => {
    try {
      const { data, error } = await supabase
        .from("repository_files")
        .update({ path, content })
        .eq("id", fileId);

      if (error) throw error;

      const file = files.find((f) => f.id === fileId);
      if (file) {
        if (path) await notifyFileChange("renamed", `${file.path} to ${path}`);
        if (content) await notifyFileChange("updated", file.path);
      }

      return data;
    } catch (e) {
      console.error("Error updating file:", e);
      throw e;
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const file = files.find((f) => f.id === fileId);
      const { error } = await supabase
        .from("repository_files")
        .delete()
        .eq("id", fileId);

      if (error) throw error;
      if (file) await notifyFileChange("deleted", file.path);
    } catch (e) {
      console.error("Error deleting file:", e);
      throw e;
    }
  };

  const starRepository = async () => {
    try {
      if (!repository) return;
      const { error } = await supabase
        .from("repositories")
        .update({ stars: (repository.stars || 0) + 1 })
        .eq("id", id);
      if (error) throw error;
    } catch (e) {
      console.error("Error starring repository:", e);
      throw e;
    }
  };

  const forkRepository = async () => {
    try {
      if (!repository || !user) return;
      // Create new repository
      const { data: newRepo, error: repoError } = await supabase
        .from("repositories")
        .insert([
          {
            name: `${repository.name}-fork`,
            description: `Fork of ${repository.name}`,
            is_private: repository.is_private,
            owner_id: user.id,
            language: repository.language,
            stars: 0,
          },
        ])
        .select()
        .single();

      if (repoError) throw repoError;

      // Copy all files
      const filesToCopy = files.map((file) => ({
        repository_id: newRepo.id,
        path: file.path,
        content: file.content,
      }));

      const { error: filesError } = await supabase
        .from("repository_files")
        .insert(filesToCopy);

      if (filesError) throw filesError;

      return newRepo;
    } catch (e) {
      console.error("Error forking repository:", e);
      throw e;
    }
  };

  const deleteRepository = async () => {
    try {
      // First delete all files
      const { error: filesError } = await supabase
        .from("repository_files")
        .delete()
        .eq("repository_id", id);

      if (filesError) throw filesError;

      // Then delete the repository
      const { error: repoError } = await supabase
        .from("repositories")
        .delete()
        .eq("id", id);

      if (repoError) throw repoError;
    } catch (e) {
      console.error("Error deleting repository:", e);
      throw e;
    }
  };

  const updateRepository = async (updates: Partial<Repository>) => {
    try {
      const { error } = await supabase
        .from("repositories")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    } catch (e) {
      console.error("Error updating repository:", e);
      throw e;
    }
  };

  return {
    repository,
    files,
    loading,
    error,
    createFile,
    updateFile,
    deleteFile,
    starRepository,
    forkRepository,
    updateRepository,
    deleteRepository,
    refetch: () => {
      fetchRepository();
      fetchFiles();
    },
  };
}
