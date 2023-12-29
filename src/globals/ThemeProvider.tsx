import React, { ReactNode, createContext, useState } from "react"
import { DarkTheme, Theme, lightTheme } from "./Themes"

type ThemeContextType =
  {
    theme: Theme,
    setTheme: (mode: "light" | "dark") => void
  }

type ThemeProps =
  {
    children: ReactNode
  }
export const ThemeContext = createContext<ThemeContextType>({
  theme: DarkTheme,
  setTheme: (mode: "light" | "dark") => { }
})

export const ThemeProvider: React.FC<ThemeProps> = ({ children }) => {
  const [theme, changeTheme] = useState<Theme>(lightTheme);

  const toggleTheme = (mode: "light" | "dark") => {
    changeTheme(mode === 'light' ? lightTheme : DarkTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};