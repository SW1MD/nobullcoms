import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Lock, Globe } from "lucide-react";
import { useState } from "react";
import { useRepositories } from "@/lib/hooks/use-repositories";
import { toast } from "@/components/ui/use-toast";

export default function RepositoryHeader() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { createRepository } = useRepositories();

  const handleCreateRepository = async () => {
    if (!name.trim()) return;

    try {
      setIsCreating(true);
      await createRepository({
        name: name.trim(),
        description: description.trim(),
        isPrivate,
      });

      toast({
        title: "Repository created",
        description: `Successfully created repository ${name}`,
      });

      // Reset form and close dialog
      setName("");
      setDescription("");
      setIsPrivate(false);
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create repository",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="border-b p-4 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Repositories</h2>
          <p className="text-sm text-gray-500">
            Collaborate on code with your team
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Repository
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new repository</DialogTitle>
              <DialogDescription>
                A repository contains all project files, including the revision
                history.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Repository name</Label>
                <Input
                  id="name"
                  placeholder="my-awesome-project"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your project"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPrivate ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-medium">
                      {isPrivate ? "Private" : "Public"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isPrivate
                        ? "Only you and your team can see this repository"
                        : "Anyone can see this repository"}
                    </div>
                  </div>
                </div>
                <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleCreateRepository}
                disabled={!name.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create repository"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
