import {
    Button,
    Container,
    Flex,
    PasswordInput,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconAt, IconLock } from "@tabler/icons-react";
import { z } from "zod";
import { pb } from "@/api/pb";

const loginSchema = z.object({
    username: z.string().min(2).max(32),
    password: z.string().min(4).max(32),
});

export default function Login() {
    const form = useForm({
        initialValues: {
            username: "",
            password: "",
        },
        validate: zodResolver(loginSchema),
    });

    const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
        const result = await pb
            .collection("users")
            .authWithPassword(values.username, values.password)
            .catch((e) => {
                console.error(e);
            });

        console.log("results", result);
    };

    return (
        <Container size={"sm"}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Flex direction={"column"} gap={"md"}>
                    <TextInput
                        label="Username"
                        placeholder="nyzs"
                        key={form.key("username")}
                        leftSection={<IconAt size={18} />}
                        {...form.getInputProps("username")}
                    />
                    <PasswordInput
                        label="Password"
                        leftSection={<IconLock size={18} />}
                        placeholder="*******"
                        key={form.key("password")}
                        {...form.getInputProps("password")}
                    />
                    <Button
                        type="submit"
                        style={{
                            alignSelf: "flex-end",
                        }}
                    >
                        Login
                    </Button>
                </Flex>
            </form>
        </Container>
    );
}
