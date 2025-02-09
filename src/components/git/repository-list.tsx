import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitBranch, GitFork, GitPullRequest } from "lucide-react";

interface Repository {
  id: string;
  name: string;
  description: string;
  branches: number;
  prs: number;
}

const repositories: Repository[] = [
  {
    id: "1",
    name: "frontend",
    description: "Main frontend repository",
    branches: 3,
    prs: 2,
  },
  {
    id: "2",
    name: "backend",
    description: "API and server code",
    branches: 5,
    prs: 1,
  },
];

export default function RepositoryList() {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {repositories.map((repo) => (
          <div key={repo.id} className="p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{repo.name}</h3>
              <Button variant="outline" size="sm">
                <GitFork className="h-4 w-4 mr-2" />
                Fork
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{repo.description}</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <GitBranch className="h-4 w-4 mr-1" />
                {repo.branches} branches
              </div>
              <div className="flex items-center">
                <GitPullRequest className="h-4 w-4 mr-1" />
                {repo.prs} pull requests
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
