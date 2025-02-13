import React, { createContext, useState, useContext } from 'react';

const MealContext = createContext();

export const MealProvider = ({ children }) => {
    const [meals, setMeals] = useState([]);

    const addMeal = (meal) => {
        setMeals([...meals, meal]);
    };

    return (
        <MealContext.Provider value={{ meals, addMeal }}>
            {children}
        </MealContext.Provider>
    );
};

export const useMeals = () => useContext(MealContext);