import { useState } from "react";

import { Link } from "react-router";
import {
    Box,
    Button,
    Card,
    Container,
    Flex,
    Group,
    LoadingOverlay,
    ScrollArea,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { Todo } from "@/types/todos";
import { pb } from "@/api/pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

export default function Home() {
    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    const { data: todos, isPending } = useQuery<Todo[]>({
        queryKey: ["todos"],
        queryFn: async () => {
            const result: Todo[] = await pb.collection("Todos").getFullList({
                sort: "-created",
            });
            return result;
        },
    });

    const mutation = useMutation({
        mutationFn: async (title: string) => {
            return await pb
                .collection("Todos")
                .create({
                    name: title,
                    content: {
                        content: "",
                    },
                    user_id: pb.authStore.record?.id,
                })
                .catch((e) => {
                    notifications.show({
                        title: "Couldn't create todo",
                        message: e.message,
                        color: "red",
                    });
                    throw e;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todos"],
            });
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate(content);
        setContent("");
    };

    return (
        <Container h={"100vh"}>
            <Flex direction={"column"} h={"50%"}>
                <Link to={"/login"}>Login</Link>
                <h1>hello world</h1>
                <ScrollArea>
                    <Flex direction={"column"} gap={"sm"}>
                        {isPending || !todos ? (
                            <LoadingOverlay />
                        ) : (
                            todos.map((todo) => (
                                <Card key={todo.id} withBorder>
                                    <Title>{todo.name}</Title>
                                    <Text>{todo.content.content}</Text>
                                </Card>
                            ))
                        )}
                    </Flex>
                </ScrollArea>
                <Box mt={"auto"}>
                    <form onSubmit={handleSubmit}>
                        <Group gap={"sm"}>
                            <TextInput
                                placeholder="Todo Name"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <Button type="submit">Add Todo</Button>
                        </Group>
                    </form>
                </Box>
            </Flex>
        </Container>
    );
}
