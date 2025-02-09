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
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface PullRequestFormProps {
  repositoryId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PullRequestForm({
  repositoryId,
  isOpen,
  onClose,
}: PullRequestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceBranch, setSourceBranch] = useState("main");
  const [targetBranch, setTargetBranch] = useState("main");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("pull_requests").insert([
        {
          repository_id: repositoryId,
          title: title.trim(),
          description: description.trim(),
          source_branch: sourceBranch,
          target_branch: targetBranch,
          status: "open",
        },
      ]);

      if (error) throw error;

      toast({
        title: "Pull request created",
        description: "Your pull request has been created successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error creating pull request:", error);
      toast({
        title: "Error",
        description: "Failed to create pull request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new pull request</DialogTitle>
          <DialogDescription>
            Propose changes to the repository.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's changing?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your changes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceBranch">Source branch</Label>
              <Input
                id="sourceBranch"
                value={sourceBranch}
                onChange={(e) => setSourceBranch(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetBranch">Target branch</Label>
              <Input
                id="targetBranch"
                value={targetBranch}
                onChange={(e) => setTargetBranch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create pull request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
