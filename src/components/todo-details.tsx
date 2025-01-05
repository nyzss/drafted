import { Center, Flex, Text, Textarea } from "@mantine/core";

export default function TodoDetails({ todo }: { todo: Todo | null }) {
    if (!todo) {
        return (
            <Center h={"100%"}>
                <Text size="xl" c={"gray"}>
                    No todo selected
                </Text>
            </Center>
        );
    }

    return (
        <Flex direction={"column"} gap={"md"}>
            <Textarea
                label="Notes"
                placeholder="Add more informatasdfion to your todo.."
                size="lg"
            />
        </Flex>
    );
}
