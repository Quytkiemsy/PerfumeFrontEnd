import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <html lang="en">
            <body>
                {children}
                <Toaster position="top-center" reverseOrder={false} />
            </body>
        </html>
    );
};

export default Layout;