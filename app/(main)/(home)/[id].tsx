import React from 'react';
import {View, Text, FlatList, Image, StyleSheet, Pressable} from 'react-native';
import { useMeals } from '../../../context/MealContext';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {FontAwesome} from "@expo/vector-icons";

export default function MealDetailScreen() {
    const { meals, removeMeal } = useMeals();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const meal = meals[parseInt(id)];

    const totalNutrients = meal ? meal.reduce((acc, ingredient) => {
        Object.keys(ingredient.nutrients).forEach((key) => {
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key] += ingredient.nutrients[key];
        });
        return acc;
    }, {}) : {};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Liste des ingrédients</Text>
            <Pressable style={styles.deleteButton} onPress={() => {
                removeMeal(parseInt(id));
                router.push('/');
            }}>
                <FontAwesome name="trash" size={24} color="black" />
            </Pressable>
            <FlatList
                data={meal}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.info}>
                            <Text style={styles.foodTitle}>{item.label}</Text>
                            <Text style={styles.foodInfos}>Calories: {Math.round(item.nutrients.ENERC_KCAL)}</Text>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}

            />
            <View style={styles.nutrients}>

                <Text style={styles.nutrientTitle}>Nutriments totaux</Text>
                {Object.entries(totalNutrients).map(([key, value]) => (
                    <Text key={key} style={styles.nutrientInfo}>
                        {key === 'ENERC_KCAL' ? 'Calories' : key === 'PROCNT' ? 'Protein' : key === 'FAT' ? 'Fat' : key}: {Math.round(value)}
                    </Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    info: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    foodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 200,
    },
    foodInfos: {
        color: 'gray',
    },
    nutrients: {
        marginTop: 20,
    },
    nutrientTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    nutrientInfo: {
        fontSize: 16,
        color: 'gray',
    },

    deleteButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
},
});