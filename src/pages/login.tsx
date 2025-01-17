import {
    Anchor,
    Button,
    Container,
    Flex,
    PasswordInput,
    Text,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconAt, IconLock } from "@tabler/icons-react";
import { z } from "zod";
import { sb } from "@/api/sb";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(32),
});

export default function Login() {
    const navigate = useNavigate();
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
            form.setErrors({
                email: result.error.message,
            });
            notifications.show({
                title: "Couldn't login",
                message: result.error.message,
                color: "red",
            });
        } else {
            navigate("/");
        }

        console.log("results", result);
    };

    return (
        <Container size={"sm"}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Flex direction={"column"} gap={"md"}>
                    <TextInput
                        label="Email"
                        placeholder="example@drafted.dev"
                        key={form.key("email")}
                        leftSection={<IconAt />}
                        size="lg"
                        {...form.getInputProps("email")}
                    />
                    <PasswordInput
                        label="Password"
                        leftSection={<IconLock />}
                        placeholder="Enter your password"
                        key={form.key("password")}
                        size="lg"
                        {...form.getInputProps("password")}
                    />
                    <Button
                        type="submit"
                        style={{
                            alignSelf: "flex-end",
                        }}
                        size="lg"
                        loading={form.submitting}
                    >
                        Login
                    </Button>
                </Flex>
            </form>
            <Text>
                Don't have an account?{" "}
                <Anchor component={Link} to={"/register"}>
                    Register
                </Anchor>
            </Text>
        </Container>
    );
}
