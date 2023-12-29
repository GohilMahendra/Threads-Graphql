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
    catch (err: any) {
        throw new Error(err?.response?.data)
    }
}
