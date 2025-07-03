import NextAuthWrapper from "@/app/lib/next.auth.wrapper";
import "../globals.css";
import React, { ReactNode } from 'react';
import SessionErrorHandler from "@/app/lib/session.error";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <>
            <NextAuthWrapper>
                <SessionErrorHandler>
                    {children}
                </SessionErrorHandler>
            </NextAuthWrapper>
        </>
    );
};

export default AdminLayout;