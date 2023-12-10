import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

const UseTheme = () =>
{
    const {theme,setTheme} = useContext(ThemeContext)
    return {theme,setTheme}
}
export default UseTheme