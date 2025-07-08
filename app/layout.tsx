import NextAuthWrapper from '@/app/lib/next.auth.wrapper';
import SessionErrorHandler from '@/app/lib/session.error';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <html lang="en">
            <body>
                <NextAuthWrapper>
                    <SessionErrorHandler>
                        {children}
                    </SessionErrorHandler>
                </NextAuthWrapper>
                <Toaster position="top-center" reverseOrder={false} />
            </body>
        </html>
    );
};



export default Layout;