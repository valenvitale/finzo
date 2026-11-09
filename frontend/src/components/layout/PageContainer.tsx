import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Navbar from './Navbar';

export function PageContainer() {
  return (
    <div className="h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex h-full flex-col md:ml-64">
        <div className="max-h-[50vh] shrink-0 overflow-y-auto">
          <Navbar />
        </div>
        <div className="shrink-0 p-6">
          <Header />
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}