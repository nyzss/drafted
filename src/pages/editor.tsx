import TextEditor from "@/components/text-editor";
import { Container, Flex } from "@mantine/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { useEditor } from "@tiptap/react";
import { Link } from "@mantine/tiptap";

export default function Editor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: "",
    });
    return (
        <Container h={"100vh"}>
            <Flex direction={"column"} py={"sm"} pb={"md"} h={"100%"}>
                <TextEditor editor={editor} />
            </Flex>
        </Container>
    );
}
