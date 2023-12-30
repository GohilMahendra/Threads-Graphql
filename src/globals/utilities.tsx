import AsyncStorage from "@react-native-async-storage/async-storage";
import { Media } from "../types/Post";
import {Dimensions} from "react-native"
const {height,width} = Dimensions.get("window")
export const timeDifference = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const seconds: number = Math.floor((now.getTime() - time.getTime()) / 1000);

    const MINUTE = 60;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;

    if (seconds < MINUTE) {
        return 'just now';
    } else if (seconds < HOUR) {
        const minutes = Math.floor(seconds / MINUTE);
        return `${minutes}m`;
    } else if (seconds < DAY) {
        const hours = Math.floor(seconds / HOUR);
        return `${hours}h`;
    } else if (seconds < MONTH) {
        const days = Math.floor(seconds / DAY);
        return `${days}d`;
    } else if (seconds < YEAR) {
        const months = Math.floor(seconds / MONTH);
        return `${months}mo`;
    } else {
        const years = Math.floor(seconds / YEAR);
        return `${years}y`;
    }
}
export const getToken = async() =>
{
    const token = await AsyncStorage.getItem("token")
    return token
}
export const getMediaImage = (media: Media) => {
    if (media.media_type.includes("video"))
        return media.thumbnail
    else
        return media.media_url
}
export const extractTags = (contentText: string) => {
    const words = contentText.split(" ")
    const hastags = words.filter((item) => (item[0] == "#"))
    return hastags
}
export const scaledFont = (fontSize:number) =>
{
    const scaleFactor = width / 375; 
    return Math.round(fontSize * scaleFactor);
}