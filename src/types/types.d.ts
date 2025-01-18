type TRoute = {
    path: string;
    name: string;
    icon: React.ReactNode;
};

type TAnalytics = {
    clicks: number;
    created_at: string;
    id: string;
    link_id: number;
    updated_at: string;
    user_id: string;
};

type TLink = {
    created_at: string;
    description: string | null;
    id: number;
    title: string | null;
    updated_at: string;
    user_id: string;
    value: string | null;
    analytics: Analytics[];
};
