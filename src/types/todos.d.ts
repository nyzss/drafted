interface BaseTable {
    id: string;
    created_at: string;
    updated_at: string;
}

interface Todo extends BaseTable {
    content: {
        content: string;
    };
    name: string;
    user_id: string;
}
