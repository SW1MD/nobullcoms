import Sidebar from "./layout/sidebar";
import MessageList from "./chat/message-list";
import MessageInput from "./chat/message-input";
import RepositoryList from "./git/repository-list";
import RepositoryHeader from "./git/repository-header";
import FileList from "./drive/file-list";
import FileHeader from "./drive/file-header";

function Home() {
  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-gray-50">
        <FileHeader />
        <FileList />
      </main>
    </div>
  );
}

export default Home;
