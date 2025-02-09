import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Lock, Globe } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Repository } from "@/lib/hooks/use-repositories";

interface RepositorySettingsProps {
  repository: Repository;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<Repository>) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function RepositorySettings({
  repository,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: RepositorySettingsProps) {
  const [name, setName] = useState(repository.name);
  const [description, setDescription] = useState(repository.description || "");
  const [isPrivate, setIsPrivate] = useState(repository.is_private || false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) return;

    try {
      setIsUpdating(true);
      await onUpdate({
        name: name.trim(),
        description: description.trim() || null,
        is_private: isPrivate,
      });

      toast({
        title: "Repository updated",
        description: "Repository settings have been updated successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update repository settings",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Repository settings</DialogTitle>
          <DialogDescription>
            Update your repository's settings and visibility.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Repository name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your project"
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

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={!name.trim() || isUpdating}>
            {isUpdating ? "Saving..." : "Save changes"}
          </Button>
        </div>

        <div className="border-t pt-6 mt-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-500">
              Once you delete a repository, there is no going back. Please be
              certain.
            </p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={async () => {
                if (
                  confirm(
                    "Are you sure you want to delete this repository? This action cannot be undone.",
                  )
                ) {
                  try {
                    await onDelete();
                    toast({
                      title: "Repository deleted",
                      description:
                        "Your repository has been permanently deleted",
                    });
                    onClose();
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to delete repository",
                      variant: "destructive",
                    });
                  }
                }
              }}
            >
              Delete Repository
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
