import { Stack } from 'expo-router/stack'

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ title: "Recettes" }}
            />
            <Stack.Screen
                name="[id]"
                options={{ title: "Détails de la recette" }}
            />
        </Stack>
    )
}