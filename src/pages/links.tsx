import { sb } from "@/api/sb";
import { Button, Card, Container, Flex, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

export default function Links() {
    const { data } = useQuery({
        queryKey: ["links"],
        queryFn: async () => {
            const resp = await sb
                .from("links")
                .select("*, analytics (*)")
                .throwOnError();
            console.log(resp.data);

            if (!resp.data) {
                return [];
            }
            const links: TLink[] = resp.data;
            return links;
        },
    });

    return (
        <Container h={"100%"} py={"xl"}>
            <Flex direction={"column"} h={"100%"}>
                {data?.map((link) => (
                    <Card withBorder key={link.id}>
                        <Title>{link.title}</Title>
                        {link.description ? (
                            <Text>{link.description}</Text>
                        ) : (
                            <Text opacity={0.7}>No description</Text>
                        )}
                    </Card>
                ))}
                <Button leftSection={<IconPlus />} mt={"auto"} size="md">
                    Add
                </Button>
            </Flex>
        </Container>
    );
}
