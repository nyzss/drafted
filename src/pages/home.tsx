import { useState } from "react";
import {
    Box,
    Button,
    Card,
    Container,
    Flex,
    LoadingOverlay,
    ScrollArea,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { sb } from "@/api/sb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import TodoDetails from "@/components/todo-details";

export default function Home() {
    const [content, setContent] = useState("");
    const [selected, setSelected] = useState<Todo | null>(null);

    const queryClient = useQueryClient();

    const { data: todos, isPending } = useQuery<Todo[]>({
        queryKey: ["todos"],
        queryFn: async () => {
            const result: Todo[] | null = (
                await sb.from("todos").select("*").order("updated_at", {
                    ascending: false,
                })
            ).data;
            if (!result) {
                return [];
            }
            return result;
        },
    });

    const mutation = useMutation({
        mutationFn: async (title: string) => {
            const { data, error } = await sb
                .from("todos")
                .insert([
                    {
                        name: title,
                        content: {
                            content: "",
                        },
                        user_id: (
                            await sb.auth.getSession()
                        ).data.session?.user.id,
                    },
                ])
                .select()
                .throwOnError();

            if (!data) {
                throw new Error(error.message);
            }
            return data as Todo[];
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["todos"], (prev: Todo[]) => [
                ...data,
                ...prev,
            ]);
            queryClient.invalidateQueries({
                queryKey: ["todos"],
            });
        },
        onError: (e) => {
            console.error("SUPABASE ERROR", e);
            notifications.show({
                title: "Couldn't create todo",
                message: "check console",
                color: "red",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate(content);
        setContent("");
    };

    const selectTodo = (id: string) => {
        console.log(id);
    };

    return (
        <Container h={"100%"} size={"xl"}>
            <Flex direction={"row"} h={"100%"} gap={"md"} py={"md"}>
                <Flex direction={"column"} h={"100%"} gap={"md"}>
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
                                        onClick={() => selectTodo(todo.id)}
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
                <Card withBorder h={"100%"} w={"100%"}>
                    <TodoDetails todo={selected} />
                </Card>
            </Flex>
        </Container>
    );
}
