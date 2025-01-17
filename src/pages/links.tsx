import { Button, Container, Flex } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export default function Links() {
    return (
        <Container h={"100%"} py={"xl"}>
            <Flex direction={"column"} h={"100%"}>
                <Button leftSection={<IconPlus />} mt={"auto"} size="md">
                    Add
                </Button>
            </Flex>
        </Container>
    );
}
