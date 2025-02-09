import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
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
import LoginPage from "@/pages/login";
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

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <ChatPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Layout>
                    <ChatPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/repositories"
              element={
                <PrivateRoute>
                  <Layout>
                    <RepositoriesPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/drive"
              element={
                <PrivateRoute>
                  <Layout>
                    <DrivePage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/tools"
              element={
                <PrivateRoute>
                  <Layout>
                    <ToolsList />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Layout>
                    <SettingsList />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Layout>
                    <NotificationsList />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/ai"
              element={
                <PrivateRoute>
                  <Layout>
                    <AIChat />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/editor"
              element={
                <PrivateRoute>
                  <Layout>
                    <CodeEditor />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
