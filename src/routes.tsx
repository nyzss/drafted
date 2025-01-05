import Home from "@/pages/home";
import Login from "@/pages/login";
import Editor from "./pages/editor";
import Todos from "./pages/todos";
import {
    IconChecklist,
    IconEdit,
    IconHome,
    IconLogin,
} from "@tabler/icons-react";

export const routes: TRoute = {
    home: {
        path: "/",
        element: <Home />,
        icon: <IconHome />,
    },
    login: {
        path: "/login",
        element: <Login />,
        icon: <IconLogin />,
        position: "bottom",
    },
    editor: {
        path: "/editor",
        element: <Editor />,
        icon: <IconEdit />,
    },
    todos: {
        path: "/todos",
        element: <Todos />,
        icon: <IconChecklist />,
    },
};
