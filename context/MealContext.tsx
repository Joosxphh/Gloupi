import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MealContext = createContext();

export const useMeals = () => useContext(MealContext);

export const MealProvider = ({ children }) => {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        const loadMeals = async () => {
            try {
                const storedMeals = await AsyncStorage.getItem('meals');
                if (storedMeals) {
                    setMeals(JSON.parse(storedMeals));
                }
            } catch (error) {
                console.error('Failed to load meals from storage', error);
            }
        };

        loadMeals();
    }, []);

    const addMeal = async (meal) => {
        const updatedMeals = [...meals, meal];
        setMeals(updatedMeals);
        try {
            await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
        } catch (error) {
            console.error('Failed to save meal to storage', error);
        }
    };

    const removeMeal = async (index) => {
        const updatedMeals = meals.filter((_, i) => i !== index);
        setMeals(updatedMeals);
        try {
            await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
        } catch (error) {
            console.error('Failed to remove meal from storage', error);
        }
    };

    return (
        <MealContext.Provider value={{ meals, addMeal, removeMeal }}>
            {children}
        </MealContext.Provider>
    );
};