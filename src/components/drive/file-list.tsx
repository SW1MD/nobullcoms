import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileIcon, FolderIcon, MoreVertical, Download } from "lucide-react";

interface File {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  modified: string;
  owner: string;
}

const files: File[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    modified: "2024-01-20",
    owner: "John Doe",
  },
  {
    id: "2",
    name: "project-proposal.pdf",
    type: "file",
    size: "2.5 MB",
    modified: "2024-01-19",
    owner: "Jane Smith",
  },
  {
    id: "3",
    name: "meeting-notes.docx",
    type: "file",
    size: "500 KB",
    modified: "2024-01-18",
    owner: "John Doe",
  },
];

export default function FileList() {
  return (
    <ScrollArea className="flex-1">
      <div className="min-w-full">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Size
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Modified
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Owner
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {file.type === "folder" ? (
                      <FolderIcon className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FileIcon className="h-5 w-5 text-gray-500" />
                    )}
                    <span>{file.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {file.size || "--"}
                </td>
                <td className="p-4 text-sm text-gray-600">{file.modified}</td>
                <td className="p-4 text-sm text-gray-600">{file.owner}</td>
                <td className="p-4">
                  <div className="flex gap-2 justify-end">
                    {file.type === "file" && (
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
}
