import * as React from "react";
import { StyleSheet, ListView } from "react-nativescript";
import { RouteProp } from "@react-navigation/core";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import axios from "axios";

type ChatScreenProps = {
    route: RouteProp<MainStackParamList, "Chat">,
    navigation: FrameNavigationProp<MainStackParamList, "Chat">,
};

type Message = {
    text: string;
    isUser: boolean;
};

export function ChatScreen({ route }: ChatScreenProps) {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [inputText, setInputText] = React.useState("");
    const { model } = route.params;

    const sendMessage = async () => {
        if (inputText.trim() === "") return;

        const userMessage: Message = { text: inputText, isUser: true };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputText("");

        try {
            const response = await axios.post(
                "https://api-inference.huggingface.co/models/" + model,
                { inputs: inputText },
                {
                    headers: {
                        Authorization: "Bearer YOUR_HUGGING_FACE_API_KEY",
                        "Content-Type": "application/json",
                    },
                }
            );

            const botMessage: Message = {
                text: response.data[0].generated_text,
                isUser: false,
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error calling Hugging Face API:", error);
            const errorMessage: Message = {
                text: "Sorry, there was an error processing your request.",
                isUser: false,
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
    };

    return (
        <flexboxLayout style={styles.container}>
            <ListView
                items={messages}
                style={styles.messageList}
                cellFactory={(message) => {
                    return (
                        <label
                            text={message.text}
                            style={message.isUser ? styles.userMessage : styles.botMessage}
                        />
                    );
                }}
            />
            <flexboxLayout style={styles.inputContainer}>
                <textField
                    style={styles.input}
                    hint="Type a message..."
                    text={inputText}
                    onTextChange={(args) => setInputText(args.value)}
                />
                <button style={styles.sendButton} onTap={sendMessage}>
                    Send
                </button>
            </flexboxLayout>
        </flexboxLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: "column",
    },
    messageList: {
        flex: 1,
    },
    userMessage: {
        backgroundColor: "#DCF8C6",
        padding: 10,
        margin: 5,
        borderRadius: 10,
        alignSelf: "flex-end",
    },
    botMessage: {
        backgroundColor: "#FFFFFF",
        padding: 10,
        margin: 5,
        borderRadius: 10,
        alignSelf: "flex-start",
    },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 20,
        padding: 10,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: "#2e6ddf",
        color: "#FFFFFF",
        borderRadius: 20,
        padding: 10,
    },
});