import {
    Button,
    Card,
    createTheme,
    Input,
    NavLink,
    Notification,
    Paper,
    TextInput,
} from "@mantine/core";

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
        Card: Card.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        Input: Input.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        TextInput: TextInput.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        NavLink: NavLink.extend({
            styles: {
                root: {
                    borderRadius: "var(--mantine-radius-md)",
                },
            },
        }),
        Notification: Notification.extend({
            defaultProps: {
                radius: "lg",
                withBorder: true,
            },
        }),
    },
});
