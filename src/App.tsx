import { BrowserRouter } from "react-router";
import Router from "./pages/router";

import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import Providers from "./contexts/providers";

function App() {
    return (
        <Providers>
            <Notifications />
            <BrowserRouter>
                <Router />
            </BrowserRouter>
        </Providers>
    );
}

export default App;
