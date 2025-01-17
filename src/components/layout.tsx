import {
    AppShell,
    Avatar,
    Box,
    Burger,
    Button,
    Flex,
    Group,
    NavLink as MantineNavLink,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, NavLink, Link } from "react-router";
import { routes } from "./routes";
import { useAuth } from "@/contexts/auth-provider";

export default function Layout() {
    const [opened, { toggle }] = useDisclosure();

    const { session } = useAuth();

    return (
        <AppShell
            header={{ height: { base: 60, md: 70, lg: 80 } }}
            navbar={{
                width: { base: 200, md: 300, lg: 300 },
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    drafted
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Flex direction={"column"} gap={"xs"} h={"100%"} py={"lg"}>
                    {routes.map((route) => (
                        <NavLink
                            to={route.path}
                            style={{
                                textDecoration: "inherit",
                                color: "inherit",
                            }}
                            key={route.path}
                        >
                            {({ isActive }) => (
                                <MantineNavLink
                                    active={isActive}
                                    label={
                                        <Text
                                            fz={"md"}
                                            fw={"bold"}
                                            tt={"capitalize"}
                                        >
                                            {route.name}
                                        </Text>
                                    }
                                    leftSection={route.icon}
                                    variant="light"
                                    component="div"
                                />
                            )}
                        </NavLink>
                    ))}

                    <Box mt={"auto"} mb={"sm"}>
                        {session ? (
                            <Flex align={"center"} gap={"sm"}>
                                <Avatar name={session.user.email} />
                                <Text c={"gray"}>{session.user.email}</Text>
                            </Flex>
                        ) : (
                            <Flex gap={"sm"}>
                                <Button
                                    variant="light"
                                    component={Link}
                                    to={"/login"}
                                    fullWidth
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="filled"
                                    component={Link}
                                    to={"/register"}
                                    fullWidth
                                >
                                    Register
                                </Button>
                            </Flex>
                        )}
                    </Box>
                </Flex>
            </AppShell.Navbar>
            <AppShell.Main h={"100vh"}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
