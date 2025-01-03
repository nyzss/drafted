import { RecordModel } from "pocketbase";

interface Todo extends RecordModel {
    content: {
        content: string;
    };
    created: string;
    name: string;
    updated: string;
    user_id: string;
}
