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

interface Generated {
    id: string;
    object: string;
    created: number;
    model: string;
    system_fingerprint: string;
    choices: {
        index: number;
        delta: {
            content?: string | null;
            role?: "system" | "user" | "assistant" | "tool";
        };
        logprobs: null;
        finish_reason: string;
    }[];
}
