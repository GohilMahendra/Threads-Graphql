import { black, grey, light_silver, secondary_dark_grey, secondary_grey, twitter_blue, white } from "./Colors"

export type ThemeMode  = "light" | "dark" 
export type Theme = {
    primary_color:string,
    secondary_color: string,
    secondary_text_color: string,
    background_color: string,
    secondary_background_color: string,
    placeholder_color: string,
    text_color: string,
    mode: ThemeMode,
}

export const DarkTheme: Theme =
{
     background_color: black,
     placeholder_color: secondary_grey,
     mode:"dark",
     primary_color:twitter_blue,
     secondary_background_color: secondary_dark_grey,
     text_color: white,
     secondary_text_color: grey,
     secondary_color: secondary_dark_grey
}

export const lightTheme: Theme = 
{
    background_color: white,
    placeholder_color: grey,
    mode:"light",
    primary_color:black,
    secondary_background_color: white,
    text_color: black,
    secondary_text_color: grey,
    secondary_color:light_silver
}