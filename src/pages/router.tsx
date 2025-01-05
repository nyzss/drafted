import { Route, Routes } from "react-router";
import Home from "./home";
import Login from "./login";
import Editor from "./editor";
import Layout from "@/components/layout";

export default function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="editor" element={<Editor />} />
            </Route>
        </Routes>
    );
}
