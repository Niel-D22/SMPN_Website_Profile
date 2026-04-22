import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';

const SIDEBAR_WIDTH = 256; // 64 * 4 (tailwind: w-64 = 16rem = 256px)
const SIDEBAR_MINIMIZED_WIDTH = 64; // w-16 = 4rem = 64px

const AdminLayout = () => {
  const [minimized, setMinimized] = useState(false);

  const handleToggleMinimize = () => setMinimized((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <div
        className={`
          transition-all duration-300
          ${minimized ? 'w-16' : 'w-64'}
          hidden lg:block
        `}>
        <Sidebar minimized={minimized} onToggleMinimize={handleToggleMinimize} />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <Header onSidebarMinimize={handleToggleMinimize} isSidebarMinimized={minimized} />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
