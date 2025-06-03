'use client'
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function SessionErrorHandler({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session?.error === "RefreshAccessTokenError") {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            signOut({ callbackUrl: "/login" });
        }
    }, [session]);

    return <>{children}</>;
}