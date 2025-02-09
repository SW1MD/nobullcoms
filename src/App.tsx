import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <ChatPage />
              </Layout>
            }
          />
          <Route
            path="/chat"
            element={
              <Layout>
                <ChatPage />
              </Layout>
            }
          />
          <Route
            path="/repositories"
            element={
              <Layout>
                <RepositoriesPage />
              </Layout>
            }
          />
          <Route
            path="/drive"
            element={
              <Layout>
                <DrivePage />
              </Layout>
            }
          />
          <Route
            path="/tools"
            element={
              <Layout>
                <ToolsList />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <SettingsList />
              </Layout>
            }
          />
          <Route
            path="/notifications"
            element={
              <Layout>
                <NotificationsList />
              </Layout>
            }
          />
          <Route
            path="/ai"
            element={
              <Layout>
                <AIChat />
              </Layout>
            }
          />
          <Route
            path="/editor"
            element={
              <Layout>
                <CodeEditor />
              </Layout>
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
