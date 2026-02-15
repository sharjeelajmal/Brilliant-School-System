"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
    themeColor: string;
    setThemeColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    themeColor: '#B70003',
    setThemeColor: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [themeColor, setThemeColor] = useState('#B70003');

    useEffect(() => {
        // Load from local storage on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.themeColor) {
                    setThemeColor(user.themeColor);
                    document.documentElement.style.setProperty('--primary', user.themeColor);
                }
            } catch (e) {
                console.error("Theme Load Error", e);
            }
        }
    }, []);

    const updateTheme = (color: string) => {
        setThemeColor(color);
        // Update CSS Variable
        document.documentElement.style.setProperty('--primary', color);

        // Update local storage user object if it exists
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            user.themeColor = color;
            localStorage.setItem('user', JSON.stringify(user));
        }
    };

    return (
        <ThemeContext.Provider value={{ themeColor, setThemeColor: updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
