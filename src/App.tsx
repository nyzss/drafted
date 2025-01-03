import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function App() {
    const [todos, setTodos] = useState<string[]>([]);

    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTodos([...todos, content]);
        setContent("");
    };

    return (
        <div className="flex justify-center h-screen">
            <div className="container h-2/3 w-1/3 p-4">
                <div className="flex flex-col h-full">
                    <h1>hello world</h1>
                    <ul>
                        {todos.map((todo) => (
                            <li key={todo}>{todo}</li>
                        ))}
                    </ul>
                    {/* <Button className="mt-auto">click on me</Button> */}
                    <form
                        className="mt-auto flex gap-4"
                        onSubmit={handleSubmit}
                    >
                        <Input
                            placeholder="Todo Name"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <Button>Add Todo</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;
