import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitPullRequest, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/auth-provider";

interface PullRequest {
  id: string;
  title: string;
  description: string;
  status: "open" | "closed" | "merged";
  created_at: string;
  author: {
    id: string;
    email: string;
    avatar_url?: string;
  };
  comments_count: number;
}

interface PullRequestListProps {
  repositoryId: string;
  onSelect: (pr: PullRequest) => void;
}

export default function PullRequestList({
  repositoryId,
  onSelect,
}: PullRequestListProps) {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    fetchPullRequests();

    const channel = supabase
      .channel(`public:pull_requests:${repositoryId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pull_requests",
          filter: `repository_id=eq.${repositoryId}`,
        },
        () => {
          fetchPullRequests();
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [repositoryId]);

  const fetchPullRequests = async () => {
    try {
      const { data: prs, error } = await supabase
        .from("pull_requests")
        .select(
          `
          *,
          author:author_id(*),
          comments_count:comments(count)
        `,
        )
        .eq("repository_id", repositoryId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPullRequests(prs);
    } catch (error) {
      console.error("Error fetching pull requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-500";
      case "closed":
        return "bg-red-500";
      case "merged":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-sm text-gray-500">Loading pull requests...</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-4 p-4">
        {pullRequests.map((pr) => (
          <div
            key={pr.id}
            className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow cursor-pointer"
            onClick={() => onSelect(pr)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <GitPullRequest className="h-4 w-4 text-purple-500" />
                  <h3 className="font-semibold hover:text-blue-500">
                    {pr.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(pr.status)} text-white`}
                  >
                    {pr.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {pr.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {pr.comments_count} comments
              </div>
              <span>
                Opened on {new Date(pr.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
