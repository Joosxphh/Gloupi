import {useEffect, useState} from 'react';
import {View, TextInput, FlatList, Text, Image, Pressable, StyleSheet, SafeAreaView} from 'react-native';
import {useRouter} from "expo-router";
import {useMeals} from "../../../context/MealContext";
import {FontAwesome} from '@expo/vector-icons';

const AddScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const router = useRouter();
    const { addMeal } = useMeals();

    useEffect(() => {
        if (query.length > 0) {
            fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.EXPO_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.EXPO_PUBLIC_EDAMAM_PUBLIC_KEY}&ingr=${query}`)
                .then(response => response.json())
                .then(data => setResults(data.hints))
                .catch(error => console.error(error));
        }
    }, [query]);

    const addIngredient = (ingredient) => {
        setSelectedIngredients([...selectedIngredients, ingredient]);
        setQuery('');
        setResults([]);
    };

    const removeIngredient = (ingredient) => {
        setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
    };

    const createMeal = () => {
        addMeal(selectedIngredients);
        setSelectedIngredients([]);
        router.push('/');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                placeholder="Rechercher des aliments 🍕"
                value={query}
                onChangeText={setQuery}
                style={styles.input}
            />

            <FlatList
                data={results}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View>
                        <View style={styles.card}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={{ uri: item.food.image }} style={{ width: 100, height: 100 }} />
                                <View style={styles.info}>
                                    <Text style={styles.foodTitle}>{item.food.label}</Text>
                                    <Text style={styles.foodInfos}>Calories:  {Math.round(item.food.nutrients.ENERC_KCAL)}</Text>
                                </View>
                            </View>
                            <Pressable onPress={() => addIngredient(item.food)} style={styles.roundButton}>
                                <FontAwesome name="plus" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                )}
            />

            {query === '' && (
                <FlatList
                    data={selectedIngredients}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
                            <View style={styles.info}>
                                <Text style={styles.foodTitle}>{item.label}</Text>
                                <Text style={styles.foodInfos}>Calories: {Math.round(item.nutrients.ENERC_KCAL)}</Text>
                            </View>
                            <Pressable onPress={() => removeIngredient(item)} style={styles.roundButton}>
                                <FontAwesome name="minus" size={24} color="white" />
                            </Pressable>
                        </View>
                    )}
                />
            )}

            {selectedIngredients.length > 0 && (
                <Pressable onPress={createMeal} style={styles.button}>
                    <Text style={styles.buttonText}>Créer un repas</Text>
                </Pressable>
            )}
        </SafeAreaView>
    );
};
export default AddScreen;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    card: {
        width: 350,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        padding: 15,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    info: {
        marginLeft: 10,
    },

    foodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 150,
        flexWrap: 'wrap',
    },

    foodInfos: {
        color: 'gray',
    },

    button: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 25,
        width: '100%',
    },

    roundButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },


    buttonText: {
        color: 'white',
        textAlign: 'center',
    },

    plusText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },

    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginVertical: 10,
    },

});