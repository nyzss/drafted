import {
    AppShell,
    Burger,
    Flex,
    Group,
    NavLink as MantineNavLink,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome, IconLogin } from "@tabler/icons-react";
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
                <Flex direction={"column"} gap={"xs"}>
                    <NavLink
                        to={"/"}
                        style={{ textDecoration: "inherit", color: "inherit" }}
                    >
                        {({ isActive }) => (
                            <MantineNavLink
                                active={isActive}
                                label={<Text>Home</Text>}
                                leftSection={<IconHome />}
                                variant="light"
                                fw="bold"
                                component="div"
                            />
                        )}
                    </NavLink>
                    <NavLink
                        to={"/login"}
                        style={{
                            textDecoration: "inherit",
                            color: "inherit",
                        }}
                    >
                        {({ isActive }) => (
                            <MantineNavLink
                                active={isActive}
                                label="Login"
                                leftSection={<IconLogin />}
                                variant="light"
                                fw="bold"
                                component="div"
                            />
                        )}
                    </NavLink>
                </Flex>
            </AppShell.Navbar>
            <AppShell.Main h={"100vh"}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
