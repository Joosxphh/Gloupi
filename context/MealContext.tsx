// context/MealContext.tsx
import React, { createContext, useContext, useState } from 'react';

const MealContext = createContext();

export const useMeals = () => useContext(MealContext);

export const MealProvider = ({ children }) => {
    const [meals, setMeals] = useState([]);

    const addMeal = (meal) => {
        setMeals([...meals, meal]);
    };

    const removeMeal = (index) => {
        setMeals(meals.filter((_, i) => i !== index));
    };

    return (
        <MealContext.Provider value={{ meals, addMeal, removeMeal }}>
            {children}
        </MealContext.Provider>
    );
};