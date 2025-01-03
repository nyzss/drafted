import { Container, PasswordInput, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconAt, IconLock } from "@tabler/icons-react";
import { z } from "zod";

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

    const handleSubmit = (values: z.infer<typeof loginSchema>) => {
        console.log(values);
    };

    return (
        <Container size={"sm"}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
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
                    placeholder="****"
                    key={form.key("username")}
                    {...form.getInputProps("username")}
                />
            </form>
        </Container>
    );
}
