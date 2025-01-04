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
import { sb } from "@/api/sb";
import { notifications } from "@mantine/notifications";

const loginSchema = z.object({
    email: z.string().min(2).max(32),
    password: z.string().min(4).max(32),
});

export default function Login() {
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: zodResolver(loginSchema),
    });

    const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
        const result = await sb.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        });

        if (result.error) {
            notifications.show({
                title: "Couldn't login",
                message: result.error.message,
                color: "red",
            });
        }

        console.log("results", result);
    };

    return (
        <Container size={"sm"}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Flex direction={"column"} gap={"md"}>
                    <TextInput
                        label="Email"
                        placeholder="nyzs"
                        key={form.key("email")}
                        leftSection={<IconAt size={18} />}
                        {...form.getInputProps("email")}
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
