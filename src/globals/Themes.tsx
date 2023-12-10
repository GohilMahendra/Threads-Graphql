import { black, light_silver, mate_black, secondary_grey, silver_background, smoke_grey, twitter_black, white } from "./Colors"

export type ThemeMode  = "light" | "dark" 
export type Theme = {
    primary_color:string,
    secondary_color: string,
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
     primary_color:black,
     secondary_background_color: smoke_grey,
     text_color: white,
     secondary_color: twitter_black
}

export const lightTheme: Theme = 
{
    background_color: black,
    placeholder_color: secondary_grey,
    mode:"dark",
    primary_color:black,
    secondary_background_color: smoke_grey,
    text_color: white,
    secondary_color: twitter_black
}