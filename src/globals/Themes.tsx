import { black, light_silver, mate_black, secondary_grey, silver_background, smoke_grey, twitter_black, twitter_blue, white } from "./Colors"

export type ThemeMode  = "light" | "dark" 
export type Theme = {
    primary_color:string,
    secondary_text_color: string,
    background_color: string,
    secondary_background_color: string,
    placeholder_color: string,
    text_color: string,
    mode: ThemeMode,
}

export const DarkTheme: Theme =
{
     background_color: "black",
     placeholder_color: secondary_grey,
     mode:"dark",
     primary_color:twitter_blue,
     secondary_background_color: "#3f3f3f",
     text_color: white,
     secondary_text_color: "grey"
}

export const lightTheme: Theme = 
{
    background_color: white,
    placeholder_color: secondary_grey,
    mode:"light",
    primary_color:black,
    secondary_background_color: light_silver,
    text_color: black,
    secondary_text_color: "grey"
}