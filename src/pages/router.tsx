import { Route, Routes } from "react-router";
import Layout from "@/components/layout";
import Register from "./register";
import Login from "./login";
import Home from "./home";
import Todos from "./todos";
import Links from "./links";

export default function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/todos" element={<Todos />} />
                <Route path="/links" element={<Links />} />
            </Route>
        </Routes>
    );
}
