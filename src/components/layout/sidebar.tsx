import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  Hash,
  Plus,
  GitBranch,
  MessageSquare,
  FolderOpen,
  Wrench,
  Settings,
  Bell,
  Bot,
  Code,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthContext } from "@/components/auth/auth-provider";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuthContext();

  const sidebarItems = [
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/repositories", icon: GitBranch, label: "Repositories" },
    { path: "/drive", icon: FolderOpen, label: "Drive" },
    { path: "/tools", icon: Wrench, label: "Tools" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
    { path: "/ai", icon: Bot, label: "AI Assistant" },
    { path: "/editor", icon: Code, label: "Editor" },
  ];

  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-64"} h-screen bg-[#1A1D21] text-white flex flex-col transition-all duration-300`}
    >
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <Button variant="ghost" className="text-white w-full justify-between">
            Workspace
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-gray-400 hover:text-white"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3">
          <TooltipProvider>
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${location.pathname === item.path ? "bg-white/10" : ""}`}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon
                        className={`h-4 w-4 ${!isCollapsed && "mr-2"}`}
                      />
                      {!isCollapsed && item.label}
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-gray-700 mt-auto">
        <div className="flex items-center justify-between">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                    />
                    <AvatarFallback>
                      {user?.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user?.user_metadata?.full_name ||
                          user?.email?.split("@")[0]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {user?.email}
                      </span>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user?.user_metadata?.full_name ||
                        user?.email?.split("@")[0]}
                    </span>
                    <span className="text-xs">{user?.email}</span>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
