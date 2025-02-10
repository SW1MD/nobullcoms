import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  GitFork,
  GitPullRequest,
  Star,
  Clock,
  Search,
  Filter,
  MessageSquare,
} from "lucide-react";

import { useRepositories } from "@/lib/hooks/use-repositories";

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-500",
};

export default function RepositoryList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { repositories, loading, error } = useRepositories();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading repositories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-500">
          Error loading repositories: {error.message}
        </p>
      </div>
    );
  }

  const filteredRepos = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Find a repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="font-semibold text-lg hover:text-blue-500 cursor-pointer"
                      onClick={() => navigate(`/repositories/${repo.id}`)}
                    >
                      {repo.name}
                    </h3>
                    <Badge variant={repo.is_private ? "secondary" : "outline"}>
                      {repo.is_private ? "Private" : "Public"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{repo.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Star
                  </Button>
                  <Button variant="outline" size="sm">
                    <GitFork className="h-4 w-4 mr-2" />
                    Fork
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full ${languageColors[repo.language] || "bg-gray-400"}`}
                  />
                  {repo.language}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {repo.stars}
                </div>
                <div className="flex items-center">
                  <GitBranch className="h-4 w-4 mr-1" />
                  {repo.branches || 0} branches
                </div>
                <div className="flex items-center">
                  <GitPullRequest className="h-4 w-4 mr-1" />
                  {repo.prs || 0} pull requests
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {repo.comments?.[0]?.count || 0} comments
                </div>
                <div
                  className="flex items-center hover:text-blue-500 cursor-pointer"
                  onClick={() => navigate(`/profile/${repo.owner_id}`)}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Created by {repo.owner_name || "Unknown"}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Updated {new Date(repo.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
