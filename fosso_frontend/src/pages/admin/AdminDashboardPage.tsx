import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Admin Sidebar */}
        <AdminSidebar />
        {/* Main Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
