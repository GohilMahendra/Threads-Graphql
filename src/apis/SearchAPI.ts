import axios from "axios"
import { getToken } from "../globals/utilities"
import { BASE_URL } from "../globals/constants"

export const searchUsers = async (term: string) => {
    const token = await getToken()
    try {
        const response = await axios.get(BASE_URL + `users?name=${term}`, {
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })
        if (response.status == 200) {
            return response.data
        }
        else {
            throw new Error(response.data)
        }
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
    }
}
