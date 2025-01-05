import { Button, createTheme, Paper } from "@mantine/core";

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
    },
});
