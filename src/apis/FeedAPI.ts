import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { BASE_URL } from "../globals/constants"
import { tokens } from "react-native-paper/lib/typescript/styles/themes/v3/tokens"

const getToken = async() =>
{
    const token = await AsyncStorage.getItem("token")
    return token
}
export const fetchPosts = async() =>
{
    try
    {
        const token = await getToken()
        const response = await axios.get(BASE_URL+"posts",{
            headers:{
                "Content-Type":"application/json",
                "token":token
            }
        })
        if(response.status == 200)
        {
            return response
        }
        else
        {
            console.log(response.data)
            throw Error(JSON.stringify(response.data))
        }
    }
    catch(err)
    {
        console.log(err)
        throw Error(JSON.stringify(err))
    }
}

export const likePost = async(postId:string)=>
{
    try
    {
        const token = await getToken()
        const response = await axios.post(BASE_URL+`posts/${postId}/likes`,{
            headers:{
                "Content-Type":"application/json",
                "token":token
            }
        })

        if(response.status == 200)
        {
            return response.data
        }
        else
        {
            throw Error(JSON.stringify(response.data))
        }
    }
    catch(err)
    {
        throw Error(JSON.stringify(err))
    }
}

export const unLikePost = async(postId:string)=>
{
    try
    {
        const token = await getToken()
        const response = await axios.delete(BASE_URL+`posts/${postId}/likes`,{
            headers:{
                "Content-Type":"application/json",
                "token":token
            }
        })

        if(response.status == 200)
        {
            return response.data
        }
        else
        {
            throw Error(JSON.stringify(response.data))
        }
    }
    catch(err)
    {
        throw Error(JSON.stringify(err))
    }
}