import { BrowserRouter } from "react-router";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import Router from "./pages/router";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import { theme } from "./lib/theme";

const client = new QueryClient();

function App() {
    return (
        <MantineProvider
            defaultColorScheme="dark"
            forceColorScheme="dark"
            theme={theme}
        >
            <ModalsProvider>
                <QueryClientProvider client={client}>
                    <Notifications />
                    <BrowserRouter>
                        <Router />
                    </BrowserRouter>
                </QueryClientProvider>
            </ModalsProvider>
        </MantineProvider>
    );
}

export default App;
