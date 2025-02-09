import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function RepositoryHeader() {
  return (
    <div className="border-b p-4 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Repositories</h2>
          <p className="text-sm text-gray-500">
            Collaborate on code with your team
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Repository
        </Button>
      </div>
    </div>
  );
}
