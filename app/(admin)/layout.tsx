import NextAuthWrapper from "@/app/lib/next.auth.wrapper";
import "../globals.css";
import React, { ReactNode } from 'react';
import SessionErrorHandler from "@/app/lib/session.error";
import SidebarAdmin from "./admin/dashboard/sidebar.admin";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <>
            {children}
            <SidebarAdmin />
        </>
    );
};

export default AdminLayout;