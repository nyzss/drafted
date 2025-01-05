import { Button, createTheme, NavLink, Paper } from "@mantine/core";

export const theme = createTheme({
    fontFamily: "Geist, serif",
    primaryColor: "yellow",
    components: {
        Button: Button.extend({
            defaultProps: {
                radius: "md",
            },
        }),
        Paper: Paper.extend({
            defaultProps: {
                radius: "xs",
            },
        }),
        NavLink: NavLink.extend({
            styles: {
                root: {
                    borderRadius: "var(--mantine-radius-md)",
                },
            },
        }),
    },
});
