import { sb } from "@/api/sb";
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
import { notifications } from "@mantine/notifications";
import { IconAt, IconLock, IconPassword } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

const registerSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(4).max(32),
        confirmPassword: z.string().min(4).max(32),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        "Passwords must match"
    );

export default function Register() {
    const navigate = useNavigate();
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        validate: zodResolver(registerSchema),
    });

    const handleSubmit = async (values: z.infer<typeof registerSchema>) => {
        const result = await sb.auth.signUp({
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
            navigate("/login");
        }

        console.log("results", result);
    };

    return (
        <Container size={"sm"}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Flex direction={"column"} gap={"md"}>
                    <TextInput
                        label="Email"
                        size="lg"
                        placeholder="example@drafted.dev"
                        key={form.key("email")}
                        leftSection={<IconAt size={18} />}
                        {...form.getInputProps("email")}
                    />
                    <PasswordInput
                        label="Password"
                        size="lg"
                        leftSection={<IconLock size={18} />}
                        placeholder="Enter your password"
                        key={form.key("password")}
                        {...form.getInputProps("password")}
                    />
                    <PasswordInput
                        size="lg"
                        label="Confirm Password"
                        leftSection={<IconPassword size={18} />}
                        placeholder="Confirm your password"
                        key={form.key("confirmPassword")}
                        {...form.getInputProps("confirmPassword")}
                    />
                    <Button
                        size="lg"
                        type="submit"
                        style={{
                            alignSelf: "flex-end",
                        }}
                    >
                        Register
                    </Button>
                </Flex>
            </form>
            <Text>
                Already have an account?{" "}
                <Anchor component={Link} to={"/login"}>
                    Login
                </Anchor>
            </Text>
        </Container>
    );
}
