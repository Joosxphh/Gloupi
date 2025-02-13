import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMeals } from '../../../context/MealContext';
import { useRouter } from 'expo-router';

export default function App() {
    const [permission, requestPermission] = useCameraPermissions();
    const { addMeal } = useMeals();
    const router = useRouter();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function handleBarCodeScanned() {
        console.log('Barcode scanned:');
        fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.EXPO_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.EXPO_PUBLIC_EDAMAM_PUBLIC_KEY}&upc=${data}`)
            .then(response => response.json())
            .then(result => {
                console.log('API response:', result); // Log the API response
                if (result.hints && result.hints.length > 0) {
                    const foodItem = result.hints[0].food;
                    addMeal([foodItem]);
                    router.push('/add');
                } else {
                    console.error('No food item found for the scanned barcode');
                }
            })
            .catch(error => console.error('Error fetching food item:', error));
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} onBarCodeScanned={handleBarCodeScanned} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});