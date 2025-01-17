/* eslint-disable react-refresh/only-export-components */
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { sb } from "@/api/sb";
import { Session } from "@supabase/supabase-js";
import { LoadingOverlay } from "@mantine/core";

export const AuthContext = createContext<{ session: Session | null }>({
    session: null,
});

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        sb.auth.getSession().then((session) => {
            setSession(session.data.session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = sb.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                session,
            }}
        >
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                transitionProps={{
                    duration: 2000,
                    transition: "fade",
                }}
                overlayProps={{
                    opacity: 1,
                    color: "gray",
                }}
            />
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
