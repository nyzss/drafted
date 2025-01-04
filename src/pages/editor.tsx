import TextEditor from "@/components/text-editor";
import { Container, Flex } from "@mantine/core";

export default function Editor() {
    return (
        <Container h={"100vh"}>
            <Flex direction={"column"} py={"sm"} pb={"md"} h={"100%"}>
                <TextEditor />
            </Flex>
        </Container>
    );
}
