import { sb } from "@/api/sb";
import {
    Button,
    Center,
    Flex,
    ScrollArea,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconSparkles } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { z } from "zod";
import TextEditor from "./text-editor";

const todoSchema = z.object({
    name: z.string().nonempty().max(255),
    content: z.string().max(1000),
});

export default function TodoDetails({ todo }: { todo: Todo | null }) {
    const [generated, setGenerated] = useState<string>();

    const form = useForm<z.infer<typeof todoSchema>>({
        initialValues: {
            name: todo?.name || "",
            content: todo?.content.content || "",
        },
        validate: zodResolver(todoSchema),
    });

    useEffect(() => {
        form.setInitialValues({
            name: todo?.name || "",
            content: todo?.content.content || "",
        });
        form.setValues({
            name: todo?.name || "",
            content: todo?.content.content || "",
        });
        setGenerated("");
        //TODO: find a better way to handle this
    }, [todo]);

    if (!todo) {
        return (
            <Center h={"100%"}>
                <Text size="xl" c={"gray"}>
                    No todo selected
                </Text>
            </Center>
        );
    }

    const handleSubmit = async (values: z.infer<typeof todoSchema>) => {
        console.log(values);
    };

    const generate = async () => {
        setGenerated("");
        const values = form.getValues();

        const decoder = new TextDecoder();
        const { data, error } = await sb.functions.invoke("ai", {
            body: {
                query: values.name,
            },
        });
        if (error) {
            console.error(error);
            notifications.show({
                title: "Error",
                message: "check console",
                color: "red",
            });
        }

        for await (const chunk of data.body) {
            const decoded = decoder.decode(chunk, { stream: true });
            const lines = decoded.split("\n");

            for (const line of lines) {
                if (line.startsWith("data:")) {
                    const rawData = line.slice(5).trim();
                    if (rawData === "[DONE]") {
                        return;
                    }
                    try {
                        const processed: Generated = JSON.parse(rawData);

                        const content = processed?.choices[0].delta?.content;

                        if (content) {
                            setGenerated((prev) => prev + content);
                        }
                        // console.log(processed);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} style={{ height: "100%" }}>
            <Flex direction={"column"} gap={"md"} h={"100%"}>
                <TextInput
                    label="Name"
                    placeholder="Buy milk.."
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                />
                <Textarea
                    label="Notes"
                    placeholder="Add more informatasdfion to your todo.."
                    size="lg"
                    key={form.key("content")}
                    {...form.getInputProps("content")}
                />

                <Flex gap={"sm"}>
                    <Button type="submit">Update</Button>
                    <Button
                        onClick={generate}
                        flex={1}
                        variant="light"
                        leftSection={<IconSparkles />}
                    >
                        Generate a description
                    </Button>
                </Flex>
                <ScrollArea h={"100%"} mt={"auto"}>
                    <Text>{generated}</Text>
                </ScrollArea>
            </Flex>
        </form>
    );
}
