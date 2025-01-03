import { useEffect, useState } from "react";

import PocketBase from "pocketbase";
import { Link } from "react-router";
import { Box, Button, Container, Flex, Group, TextInput } from "@mantine/core";

export default function Home() {
    const [todos, setTodos] = useState<string[]>([]);

    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTodos([...todos, content]);
        setContent("");
    };

    useEffect(() => {
        const fetchTodos = async () => {
            const pb = new PocketBase("https://test.okankoca.dev/admin");
            const result = await pb.collection("Todos").getFullList();
            console.log("results", result);
        };
        fetchTodos();
    }, []);

    return (
        <Container h={"100vh"}>
            <Flex direction={"column"} h={"50%"}>
                <Link to={"/login"}>Login</Link>
                <h1>hello world</h1>
                <ul>
                    {todos.map((todo) => (
                        <li key={todo}>{todo}</li>
                    ))}
                </ul>
                <Box mt={"auto"}>
                    <form onSubmit={handleSubmit}>
                        <Group gap={"sm"}>
                            <TextInput
                                placeholder="Todo Name"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <Button>Add Todo</Button>
                        </Group>
                    </form>
                </Box>
            </Flex>
        </Container>
    );
}
