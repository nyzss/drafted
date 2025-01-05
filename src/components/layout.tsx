import { routes } from "@/routes";
import {
    AppShell,
    Box,
    Burger,
    Flex,
    Group,
    NavLink as MantineNavLink,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconHome, IconLogin } from "@tabler/icons-react";
import { Outlet, NavLink } from "react-router";

export default function Layout() {
    const [opened, { toggle }] = useDisclosure();

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
                    stardust
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Flex direction={"column"} gap={"xs"} h={"100%"} py={"lg"}>
                    {Object.entries(routes)
                        .filter(([_, route]) => route.position !== "bottom")
                        .map(([path, route]) => (
                            <NavLink
                                to={route.path}
                                style={{
                                    textDecoration: "inherit",
                                    color: "inherit",
                                }}
                                key={path}
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
                                                {path}
                                            </Text>
                                        }
                                        leftSection={route.icon}
                                        variant="light"
                                        component="div"
                                    />
                                )}
                            </NavLink>
                        ))}

                    <Box mt={"auto"}>
                        {Object.entries(routes)
                            .filter(([_, route]) => route.position === "bottom")
                            .map(([path, route]) => (
                                <NavLink
                                    to={route.path}
                                    style={{
                                        textDecoration: "inherit",
                                        color: "inherit",
                                    }}
                                    key={path}
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
                                                    {path}
                                                </Text>
                                            }
                                            leftSection={route.icon}
                                            variant="light"
                                            component="div"
                                        />
                                    )}
                                </NavLink>
                            ))}
                    </Box>
                </Flex>
            </AppShell.Navbar>
            <AppShell.Main h={"100vh"}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
