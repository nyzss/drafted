import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import { MantineProvider } from "@mantine/core";
import Login from "./pages/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

const client = new QueryClient();

function App() {
    return (
        <MantineProvider defaultColorScheme="dark" forceColorScheme="dark">
            <ModalsProvider>
                <QueryClientProvider client={client}>
                    <Notifications />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="login" element={<Login />} />
                        </Routes>
                    </BrowserRouter>
                </QueryClientProvider>
            </ModalsProvider>
        </MantineProvider>
    );
}

export default App;
