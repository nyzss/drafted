import { Route, Routes } from "react-router";
import Layout from "@/components/layout";
import { routes } from "@/routes";

export default function Router() {
    return (
        <Routes>
            <Route element={<Layout />}>
                {Object.entries(routes).map(([key, { element, path }]) => (
                    <Route key={key} path={path} element={element} />
                ))}
            </Route>
        </Routes>
    );
}
