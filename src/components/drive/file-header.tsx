import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Search, FolderPlus } from "lucide-react";

export default function FileHeader() {
  return (
    <div className="border-b p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Cloud Drive</h2>
          <p className="text-sm text-gray-500">
            Share and manage files with your team
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input placeholder="Search files and folders..." className="pl-9" />
      </div>
    </div>
  );
}
