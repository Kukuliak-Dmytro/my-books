"use client";
import { useEffect, useState } from "react";
import { verifyToken } from "@/services/auth";
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState(false);
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                window.location.href = "/auth/login";
                return;
            }

            try {
                await verifyToken(token);
                setIsAuth(true);
            } catch (error) {
                window.location.href = "/auth/login";
            }
        };

        checkAuth();
    },[])
    
    if(!isAuth) {
        return <div>Loading...</div>;
    }
    
    return <>{children}</>;
}

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
