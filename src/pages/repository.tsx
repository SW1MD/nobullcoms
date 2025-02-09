import { useParams, useNavigate } from "react-router-dom";
import { useRepository } from "@/lib/hooks/use-repository";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommentList from "@/components/comments/comment-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GitBranch,
  GitFork,
  GitPullRequest,
  Star,
  Clock,
  Search,
  Filter,
  Plus,
  File,
  Folder,
  Cog,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import FileViewer from "@/components/git/file-viewer";
import RepositorySettings from "@/components/git/repository-settings";
import PullRequestList from "@/components/git/pull-request-list";
import PullRequestForm from "@/components/git/pull-request-form";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function RepositoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    repository,
    files,
    loading,
    error,
    createFile,
    updateFile,
    deleteFile,
    refetch,
    starRepository,
    forkRepository,
    updateRepository,
    deleteRepository,
  } = useRepository(id!);
  const [selectedFile, setSelectedFile] = useState<(typeof files)[0] | null>(
    null,
  );
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [showFileForm, setShowFileForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrFormOpen, setIsPrFormOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"files" | "pull-requests">(
    "files",
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading repository...</p>
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-500">
          Error loading repository: {error?.message}
        </p>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
      setShowFileForm(false);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((files) => files.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    try {
      setIsUploading(true);
      for (const file of uploadedFiles) {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              await createFile({
                path: file.name,
                content: (e.target?.result as string) || "",
              });
              resolve(null);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }
      setUploadedFiles([]);
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${uploadedFiles.length} files`,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFile = async () => {
    try {
      setIsCreatingFile(true);
      await createFile({
        path: newFileName,
        content: newFileContent,
      });
      setNewFileName("");
      setNewFileContent("");
      toast({
        title: "File created",
        description: `Successfully created ${newFileName}`,
      });
    } catch (error) {
      console.error("Error creating file:", error);
      toast({
        title: "Error",
        description: "Failed to create file",
        variant: "destructive",
      });
    } finally {
      setIsCreatingFile(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    try {
      await deleteFile(fileId);
      await refetch(); // Refresh the file list after deletion
      toast({
        title: "File deleted",
        description: `Successfully deleted ${fileName}`,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">{repository.name}</h1>
            <p className="text-sm text-gray-500">{repository.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPrFormOpen(true)}
            >
              <GitPullRequest className="h-4 w-4 mr-2" />
              New PR
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Cog className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await starRepository();
                  toast({
                    title: "Repository starred",
                    description:
                      "You have successfully starred this repository",
                  });
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to star repository",
                    variant: "destructive",
                  });
                }
              }}
            >
              <Star className="h-4 w-4 mr-2" />
              Star
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const forkedRepo = await forkRepository();
                  toast({
                    title: "Repository forked",
                    description: "Repository has been forked successfully",
                  });
                  if (forkedRepo) {
                    navigate(`/repositories/${forkedRepo.id}`);
                  }
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to fork repository",
                    variant: "destructive",
                  });
                }
              }}
            >
              <GitFork className="h-4 w-4 mr-2" />
              Fork
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Badge variant={repository.is_private ? "secondary" : "outline"}>
            {repository.is_private ? "Private" : "Public"}
          </Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1" />
            {repository.stars} stars
          </div>
          <div className="flex items-center">
            <GitPullRequest className="h-4 w-4 mr-1" />
            {repository.pull_requests_count || 0} pull requests
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            {repository.comments_count || 0} comments
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Updated {new Date(repository.updated_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="p-4 flex-1">
        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as typeof selectedTab)}
        >
          <TabsList>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Find a file..."
                    className="pl-9 w-[300px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add files</DialogTitle>
                    <DialogDescription>
                      Create a new file or upload multiple files.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="space-y-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setShowFileForm(true)}
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <File className="h-8 w-8 mb-2 text-gray-400" />
                          <h3 className="font-medium">Create file</h3>
                          <p className="text-sm text-gray-500">
                            Create a single file with content
                          </p>
                        </div>
                      </div>
                      <label className="space-y-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload className="h-8 w-8 mb-2 text-gray-400" />
                          <h3 className="font-medium">Upload files</h3>
                          <p className="text-sm text-gray-500">
                            Choose files or drag and drop
                          </p>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </div>
                      </label>
                    </div>

                    {showFileForm && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="space-y-2">
                          <Label>File name</Label>
                          <Input
                            placeholder="e.g. src/components/Button.tsx"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <textarea
                            className="w-full h-64 p-2 border rounded-md font-mono text-sm"
                            placeholder="File content..."
                            value={newFileContent}
                            onChange={(e) => setNewFileContent(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={handleCreateFile}
                          disabled={!newFileName.trim() || isCreatingFile}
                        >
                          {isCreatingFile ? "Creating..." : "Create file"}
                        </Button>
                      </div>
                    )}

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="space-y-2">
                          <Label>Files to upload</Label>
                          <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 border rounded"
                              >
                                <span className="text-sm truncate">
                                  {file.name}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => removeUploadedFile(index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={handleUploadFiles}
                          disabled={isUploading}
                          className="w-full"
                        >
                          {isUploading
                            ? "Uploading..."
                            : `Upload ${uploadedFiles.length} files`}
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[calc(100vh-16rem)] border rounded-lg bg-white">
              <div className="divide-y">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-4 w-4 text-gray-500" />
                      <span className="font-mono text-sm">{file.path}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(file);
                          setIsViewerOpen(true);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeleteFile(file.id, file.path)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="pull-requests" className="mt-4">
            <PullRequestList
              repositoryId={repository.id}
              onSelect={(pr) => {
                // Handle PR selection
                console.log("Selected PR:", pr);
              }}
            />
          </TabsContent>

          <TabsContent value="comments" className="mt-4">
            <CommentList repositoryId={repository.id} />
          </TabsContent>
        </Tabs>

        <FileViewer
          file={selectedFile}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedFile(null);
          }}
          onSave={async (content) => {
            if (!selectedFile) return;
            await updateFile(selectedFile.id, { content });
          }}
        />

        <RepositorySettings
          repository={repository}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onUpdate={updateRepository}
          onDelete={async () => {
            await deleteRepository();
            navigate("/repositories");
          }}
        />

        <PullRequestForm
          repositoryId={repository.id}
          isOpen={isPrFormOpen}
          onClose={() => setIsPrFormOpen(false)}
        />
      </div>
    </div>
  );
}
