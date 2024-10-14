import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { Picker } from "@react-native-picker/picker";

type HomeScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "Home">,
};

const models = [
    "gpt2",
    "bert-base-uncased",
    "roberta-base",
    "distilbert-base-uncased",
    "facebook/bart-large-cnn",
];

export function HomeScreen({ navigation }: HomeScreenProps) {
    const [selectedModel, setSelectedModel] = React.useState(models[0]);

    return (
        <flexboxLayout style={styles.container}>
            <label className="text-2xl mb-4 font-bold text-center">
                Select a Hugging Face Model
            </label>
            <Picker
                selectedValue={selectedModel}
                onValueChange={(itemValue) => setSelectedModel(itemValue)}
                style={styles.picker}
            >
                {models.map((model) => (
                    <Picker.Item key={model} label={model} value={model} />
                ))}
            </Picker>
            <button
                style={styles.button}
                onTap={() => navigation.navigate("Chat", { model: selectedModel })}
            >
                Start Chat
            </button>
        </flexboxLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        padding: 20,
    },
    picker: {
        width: "100%",
        marginBottom: 20,
    },
    button: {
        fontSize: 18,
        color: "#ffffff",
        backgroundColor: "#2e6ddf",
        padding: 10,
        borderRadius: 5,
        textAlign: "center",
    },
});