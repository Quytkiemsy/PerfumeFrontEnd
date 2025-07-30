import { ReactNode } from 'react';
import SidebarAdmin from "../components/admin/sidebar.admin";
import "../globals.css";

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