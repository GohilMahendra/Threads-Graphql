import React, { ReactNode, createContext, useState } from "react"
import { DarkTheme, Theme, lightTheme } from "./Themes"

type ThemeContextType = 
{
  theme: Theme,
    setTheme: () => void
}

type ThemeProps = 
{
    children: ReactNode
}
export const ThemeContext = createContext<ThemeContextType>({
   theme: DarkTheme,
    setTheme:()=>{}
})

export const ThemeProvider: React.FC <ThemeProps> = ({ children }) => {
    const [theme, changeTheme] = useState<Theme>(lightTheme);
  
    const toggleTheme = () => {
      changeTheme(theme.mode === 'light' ? DarkTheme : lightTheme);
    };
  
    return (
      <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };