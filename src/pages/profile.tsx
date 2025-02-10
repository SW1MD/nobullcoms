import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitBranch, MessageSquare, Mail, Send } from "lucide-react";
import { useAuthContext } from "@/components/auth/auth-provider";
import { toast } from "@/components/ui/use-toast";
import { useUserProfile } from "@/lib/hooks/use-user-profile";

interface UserStats {
  repositories_count: number;
  comments_count: number;
  messages_count: number;
}

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { profile, loading: profileLoading } = useUserProfile(id!);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  useEffect(() => {
    if (isMessageDialogOpen) {
      fetchMessages();

      // Subscribe to new messages
      const channel = supabase
        .channel(`direct_messages:${user?.id}:${id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "direct_messages",
            filter: `(sender_id=eq.${user?.id} AND recipient_id=eq.${id}) OR (sender_id=eq.${id} AND recipient_id=eq.${user?.id})`,
          },
          () => {
            fetchMessages();
          },
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [isMessageDialogOpen, user?.id, id]);
  const [messageContent, setMessageContent] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchMessages = async () => {
    if (!user || !id) return;

    try {
      setLoadingMessages(true);
      const { data, error } = await supabase.rpc("get_conversation", {
        user1_id: user.id,
        user2_id: id,
      });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!messageContent.trim() || !user || !profile) return;

    try {
      setSending(true);
      const { error } = await supabase.from("direct_messages").insert({
        sender_id: user.id,
        recipient_id: profile.id,
        content: messageContent.trim(),
      });

      if (error) throw error;

      setMessageContent("");
      await fetchMessages();
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading && profileLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg border shadow-sm">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  profile.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
                }
              />
              <AvatarFallback>
                {profile.display_name?.[0] || profile.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {profile.display_name || profile.email.split("@")[0]}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                </div>
                {user && user.id !== profile.id && (
                  <Button
                    variant="outline"
                    onClick={() => setIsMessageDialogOpen(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                )}
              </div>

              <div className="mt-4 space-y-2">
                {profile.company && (
                  <p className="text-sm text-gray-600">
                    Works at {profile.company}
                  </p>
                )}
                {profile.location && (
                  <p className="text-sm text-gray-600">
                    Located in {profile.location}
                  </p>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline block"
                  >
                    {profile.website}
                  </a>
                )}
              </div>

              {stats && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600">
                      <GitBranch className="h-4 w-4" />
                      <span>Repositories</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.repositories_count || 0}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>Comments</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.comments_count || 0}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>Messages</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.messages_count || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Message {profile.display_name || profile.email.split("@")[0]}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {loadingMessages ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.sender_id === user?.id ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${message.sender_id === user?.id ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="border-t pt-4 mt-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Write a message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="min-h-[80px]"
              />
              <Button
                className="self-end"
                size="icon"
                onClick={sendMessage}
                disabled={!messageContent.trim() || sending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
