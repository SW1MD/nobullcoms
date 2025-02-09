import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useComments } from "@/lib/hooks/use-comments";
import { useAuthContext } from "@/components/auth/auth-provider";
import { useSettings } from "@/lib/hooks/use-settings";

interface CommentListProps {
  repositoryId: string;
}

export default function CommentList({ repositoryId }: CommentListProps) {
  const { comments, loading, error, addComment } = useComments(repositoryId);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthContext();
  const { settings } = useSettings();

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;

    try {
      setIsSubmitting(true);
      await addComment({
        content: content.trim(),
        user_id: user.id,
        user_name:
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Anonymous",
        user_avatar:
          settings?.avatar_url ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      });
      setContent("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-sm text-gray-500">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-sm text-red-500">
          Error loading comments: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user_avatar} />
                  <AvatarFallback>
                    {comment.user_name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{comment.user_name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                settings?.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`
              }
            />
            <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
