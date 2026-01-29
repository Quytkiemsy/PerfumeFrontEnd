'use client';
import { ReactNode } from 'react';
import SidebarAdmin from "../components/admin/sidebar.admin";
import { SidebarProvider, useSidebar } from "../components/admin/SidebarProvider";
import "../globals.css";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayoutContent = ({ children }: AdminLayoutProps) => {
    const { isCollapsed } = useSidebar();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-slate-100">
            <SidebarAdmin />
            {/* Main Content - offset by sidebar width */}
            <main 
                style={{ marginLeft: isCollapsed ? '88px' : '280px' }}
                className="hidden lg:block transition-[margin] duration-300 ease-out"
            >
                {children}
            </main>
            {/* Mobile - no margin */}
            <main className="lg:hidden">
                {children}
            </main>
        </div>
    );
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <SidebarProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </SidebarProvider>
    );
};

export default AdminLayout;