import { IconChecklist, IconHome, IconLink } from "@tabler/icons-react";

export const routes: TRoute[] = [
    {
        path: "/",
        name: "Home",
        icon: <IconHome size={18} />,
    },
    {
        path: "/links",
        name: "Links",
        icon: <IconLink size={18} />,
    },
    {
        path: "/todos",
        name: "Todos",
        icon: <IconChecklist size={18} />,
    },
];
