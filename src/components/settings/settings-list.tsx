import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Moon,
  Globe,
  Shield,
  Upload,
  Layout,
  Palette,
  User,
  MessageSquare,
  GitBranch,
  FolderOpen,
  Wrench,
  Settings,
  Bot,
  Code,
} from "lucide-react";

const sidebarPages = [
  { id: "chat", name: "Chat", icon: MessageSquare, default: true },
  { id: "repositories", name: "Repositories", icon: GitBranch, default: true },
  { id: "drive", name: "Drive", icon: FolderOpen, default: true },
  { id: "tools", name: "Tools", icon: Wrench, default: true },
  { id: "settings", name: "Settings", icon: Settings, default: true },
  { id: "notifications", name: "Notifications", icon: Bell, default: true },
  { id: "ai", name: "AI Assistant", icon: Bot, default: true },
  { id: "editor", name: "Editor", icon: Code, default: false },
];

const settings = [
  {
    id: "profile",
    category: "Profile",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=current-user" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Change Avatar
          </Button>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" defaultValue="John Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" placeholder="Tell us about yourself" />
          </div>
          <Button>Save Changes</Button>
        </div>
      </div>
    ),
  },
  {
    id: "sidebar",
    category: "Sidebar",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Layout Options</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layout className="h-4 w-4 text-gray-500" />
                <span>Compact Mode</span>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="h-4 w-4 text-gray-500" />
                <span>Custom Theme</span>
              </div>
              <Switch />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Visible Pages</h4>
          <div className="space-y-2">
            {sidebarPages.map((page) => (
              <div key={page.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <page.icon className="h-4 w-4 text-gray-500" />
                  <span>{page.name}</span>
                </div>
                <Switch defaultChecked={page.default} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "appearance",
    category: "Appearance",
    items: [
      { id: "dark-mode", name: "Dark Mode", icon: Moon },
      { id: "compact-view", name: "Compact View", icon: null },
    ],
  },
  {
    id: "notifications",
    category: "Notifications",
    items: [
      { id: "desktop", name: "Desktop Notifications", icon: Bell },
      { id: "sounds", name: "Notification Sounds", icon: null },
    ],
  },
  {
    id: "privacy",
    category: "Privacy",
    items: [
      { id: "visibility", name: "Profile Visibility", icon: Globe },
      { id: "2fa", name: "Two-Factor Auth", icon: Shield },
    ],
  },
];

export default function SettingsList() {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6">
        {settings.map((section) => (
          <div key={section.id} className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-4">{section.category}</h3>
            {section.content ? (
              section.content
            ) : (
              <div className="space-y-4">
                {section.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && (
                        <item.icon className="h-4 w-4 text-gray-500" />
                      )}
                      <span>{item.name}</span>
                    </div>
                    <Switch />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
