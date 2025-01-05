type TRoute = Record<
    string,
    {
        path: string;
        element: React.ReactNode;
        icon: React.ReactNode;
        position?: "top" | "bottom";
    }
>;
