import { useState } from "react";

import { Link } from "react-router";
import {
    Anchor,
    Box,
    Button,
    Card,
    Container,
    Flex,
    LoadingOverlay,
    ScrollArea,
    Text,
    Textarea,
    TextInput,
    Title,
} from "@mantine/core";
import { Todo } from "@/types/todos";
import { pb } from "@/api/pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { modals } from "@mantine/modals";

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
            <Flex direction={"column"} h={"95%"} gap={"md"} py={"sm"}>
                <Anchor component={Link} to={"/login"}>
                    <Text size="xl">Login</Text>
                </Anchor>
                <ScrollArea offsetScrollbars scrollbars="y" type="auto">
                    <Flex direction={"column"} gap={"sm"} pr={"xs"}>
                        {isPending || !todos ? (
                            <LoadingOverlay />
                        ) : (
                            todos.map((todo) => (
                                <Card
                                    key={todo.id}
                                    withBorder
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        modals.open({
                                            title: todo.name,
                                            children: (
                                                <Flex>
                                                    <Textarea
                                                        label="Edit your todo content"
                                                        placeholder="Go to the shop"
                                                    />
                                                </Flex>
                                            ),
                                        })
                                    }
                                >
                                    <Title>{todo.name}</Title>
                                    <Text>{todo.content.content}</Text>
                                </Card>
                            ))
                        )}
                    </Flex>
                </ScrollArea>
                <Box mt={"auto"}>
                    <form onSubmit={handleSubmit}>
                        <Flex gap={"sm"} align={"flex-end"}>
                            <TextInput
                                placeholder="Buy milk.."
                                value={content}
                                label="What needs to be done?"
                                onChange={(e) => setContent(e.target.value)}
                                flex={1}
                                size="lg"
                            />
                            <Button
                                type="submit"
                                size="lg"
                                leftSection={<IconPlus />}
                            >
                                Add Todo
                            </Button>
                        </Flex>
                    </form>
                </Box>
            </Flex>
        </Container>
    );
}
