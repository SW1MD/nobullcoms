import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/layout/layout";
import MessageList from "./components/chat/message-list";
import MessageInput from "./components/chat/message-input";
import RepositoryList from "./components/git/repository-list";
import RepositoryHeader from "./components/git/repository-header";
import FileList from "./components/drive/file-list";
import FileHeader from "./components/drive/file-header";
import ToolsList from "./components/tools/tools-list";
import SettingsList from "./components/settings/settings-list";
import NotificationsList from "./components/notifications/notifications-list";
import AIChat from "./components/ai/ai-chat";
import CodeEditor from "./components/editor/code-editor";
import routes from "tempo-routes";
import { AuthProvider } from "@/components/auth/auth-provider";
import { MessageProvider } from "@/contexts/message-context";
import { NotificationProvider } from "@/contexts/notification-context";
import LoginPage from "@/pages/login";
import RepositoryPage from "@/pages/repository";
import ProfilePage from "@/pages/profile";
import { useAuthContext } from "@/components/auth/auth-provider";

function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      <MessageList />
      <MessageInput />
    </div>
  );
}

function RepositoriesPage() {
  return (
    <div className="flex flex-col h-full">
      <RepositoryHeader />
      <RepositoryList />
    </div>
  );
}

function DrivePage() {
  return (
    <div className="flex flex-col h-full">
      <FileHeader />
      <FileList />
    </div>
  );
}

function PrivateRoute() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MessageProvider>
          <Suspense fallback={<div>Loading...</div>}>
            {/* Tempo routes */}
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

            <Routes>
              <Route path="/login" element={<LoginPage />} />

              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route index element={<Navigate to="/chat" />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/repositories" element={<RepositoriesPage />} />
                  <Route
                    path="/repositories/:id"
                    element={<RepositoryPage />}
                  />
                  <Route path="/drive" element={<DrivePage />} />
                  <Route path="/tools" element={<ToolsList />} />
                  <Route path="/settings" element={<SettingsList />} />
                  <Route
                    path="/notifications"
                    element={<NotificationsList />}
                  />
                  <Route path="/ai" element={<AIChat />} />
                  <Route path="/editor" element={<CodeEditor />} />
                  <Route path="profile/:id" element={<ProfilePage />} />
                </Route>
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/chat" />} />
            </Routes>
          </Suspense>
        </MessageProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
