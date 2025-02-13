import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { FlatList, Text, View, Image, Pressable, Button } from 'react-native';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useMeals } from '../../../context/MealContext';
import {FontAwesome} from "@expo/vector-icons";

export default function HomeScreen() {
    const { meals, removeMeal } = useMeals();
    const publicKey = process.env.EXPO_PUBLIC_EDAMAM_PUBLIC_KEY!;
    const publicId = process.env.EXPO_PUBLIC_EDAMAM_APP_ID!;
    const router = useRouter();

    if (!publicKey) {
        throw new Error('Add EXPO_PUBLIC_EDAMAM_PUBLIC_KEY in your .env');
    }

    useEffect(() => {
        fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${publicId}&app_key=${publicKey}`)
            .then((response) => response.json())
            .catch((error) => console.error(error));
    }, []);

    return (
        <View style={styles.container}>
            <SignedIn>
                <FlatList
                    data={meals}
                    renderItem={({ item, index }) => (
                        <Pressable onPress={() => router.push(`/${index}`)}>
                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.title}>Recette {index + 1}</Text>
                                    <Text>{item.length} ingrédients</Text>
                                    <Pressable title="Supprimer" onPress={() => removeMeal(index)} >
                                        <FontAwesome name="trash" size={24} color="black" />
                                    </Pressable>
                                </View>
                                <FlatList
                                    data={item}
                                    renderItem={({ item }) => (
                                        <View style={styles.cardInside}>
                                            <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
                                            <View style={styles.info}>
                                                <Text style={styles.foodTitle}>{item.label}</Text>
                                                <Text style={styles.foodInfos}>Calories: {Math.round(item.nutrients.ENERC_KCAL)}</Text>
                                            </View>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        </Pressable>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </SignedIn>
            <SignedOut>
                <View style={styles.buttonContainer}>
                    <Link href="/(auth)/login" style={styles.button}>
                        <Text style={styles.buttonText}>Connexion</Text>
                    </Link>
                    <Link href="/(auth)/signup" style={styles.button}>
                        <Text style={styles.buttonText}>Inscription</Text>
                    </Link>
                </View>
            </SignedOut>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 10,
    },

    button: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 25,
    },

    buttonText: {
        color: 'white',
    },

    card: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        borderRadius: 10,
        padding: 15,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 350,
    },

    cardInside: {
        flexDirection: 'row',
        margin: 10,
        borderTopWidth: 1,
        borderColor: 'gray',
        paddingVertical: 10,
    },

    info: {
        marginLeft: 10,
    },

    foodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 150,
    },

    foodInfos: {
        color: 'gray',
    },

    title:{
        fontSize: 20,
        fontWeight: 'bold',
            marginBottom: 10,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    }

})