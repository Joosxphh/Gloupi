import {Stack} from "expo-router/stack";


export default function Layout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                  title: "Ajouter un produit",
                }}
            >
            </Stack.Screen>
        </Stack>

    )
}