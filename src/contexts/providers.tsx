import { theme } from "@/lib/theme";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./auth-provider";
const client = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <MantineProvider
                defaultColorScheme="dark"
                forceColorScheme="dark"
                theme={theme}
            >
                <ModalsProvider>
                    <QueryClientProvider client={client}>
                        {children}
                    </QueryClientProvider>
                </ModalsProvider>
            </MantineProvider>
        </AuthProvider>
    );
}
