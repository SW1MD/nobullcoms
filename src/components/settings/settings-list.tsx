import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/lib/hooks/use-settings";
import ProfileSettings from "./profile-settings";
import {
  Bell,
  Moon,
  Globe,
  Shield,
  Layout,
  Palette,
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

export default function SettingsList() {
  const { settings, updateSettings, loading } = useSettings();

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    );
  }

  const handleSettingChange = async (key: string, value: any) => {
    try {
      await updateSettings({ [key]: value });
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  };

  const settingsSections = [
    {
      id: "profile",
      category: "Profile",
      content: <ProfileSettings />,
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
                <Switch
                  checked={settings?.compact_mode}
                  onCheckedChange={(checked) =>
                    handleSettingChange("compact_mode", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-4 w-4 text-gray-500" />
                  <span>Dark Theme</span>
                </div>
                <Switch
                  checked={settings?.theme === "dark"}
                  onCheckedChange={(checked) =>
                    handleSettingChange("theme", checked ? "dark" : "light")
                  }
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Visible Pages</h4>
            <div className="space-y-2">
              {sidebarPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <page.icon className="h-4 w-4 text-gray-500" />
                    <span>{page.name}</span>
                  </div>
                  <Switch
                    checked={settings?.visible_pages.includes(page.id)}
                    onCheckedChange={(checked) => {
                      const pages = [...(settings?.visible_pages || [])];
                      if (checked && !pages.includes(page.id)) {
                        pages.push(page.id);
                      } else if (!checked) {
                        const index = pages.indexOf(page.id);
                        if (index > -1) pages.splice(index, 1);
                      }
                      handleSettingChange("visible_pages", pages);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "notifications",
      category: "Notifications",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-gray-500" />
              <span>Enable Notifications</span>
            </div>
            <Switch
              checked={settings?.notifications_enabled}
              onCheckedChange={(checked) =>
                handleSettingChange("notifications_enabled", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-gray-500" />
              <span>Notification Sounds</span>
            </div>
            <Switch
              checked={settings?.notification_sounds}
              onCheckedChange={(checked) =>
                handleSettingChange("notification_sounds", checked)
              }
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6">
        {settingsSections.map((section) => (
          <div key={section.id} className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-4">{section.category}</h3>
            {section.content}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
