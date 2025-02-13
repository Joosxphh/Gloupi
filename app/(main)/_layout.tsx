import {Redirect, Tabs} from "expo-router";
import {FontAwesome} from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {useAuth} from "@clerk/clerk-expo";

export default function Layout() {

    const { isSignedIn } = useAuth()

    if (!isSignedIn) {
        return <Redirect href={'/login'} />

    }

    return (
        <Tabs>
            <Tabs.Screen
                name="(home)"
                options={{
                    title: "Accueil",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) =>
                        <FontAwesome name="home" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: "Produits",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) =>
                        <MaterialCommunityIcons name="food-apple" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profil",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <FontAwesome name="user" color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}