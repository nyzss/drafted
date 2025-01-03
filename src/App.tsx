import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import { MantineProvider } from "@mantine/core";
import Login from "./pages/login";
import "@mantine/core/styles.css";

function App() {
    return (
        <MantineProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    );
}

export default App;
