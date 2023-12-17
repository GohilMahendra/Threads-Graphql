import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from "../globals/constants";
import { SignUpArgsType } from "../types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
const getToken = async() =>
{
    const token = await AsyncStorage.getItem("token")
    return token
}
export const loginUser = async(email:string,password:string) =>
{
    try{
        email = email.toLowerCase()
        const response = await axios.post(
            `${BASE_URL}login`,
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
          );
        
          console.log(response)
          return response.data;
    }
    catch(error:any)
    {
        throw "Error "+ JSON.stringify(error)
    }

}

export const signUpUser = async(args:SignUpArgsType) =>
{
    try
    {
        args.email = args.email.toLowerCase()
        const response  = await axios.post(
            `${BASE_URL}register`,
            {...args},
            {headers: { 'Content-Type': 'application/json' } }
        )
        console.log(response)
        return response.data
    }
    catch(error:any)
    {
        console.log(error)
        throw error?.response?.data;
    }
}

export const updateUser = async(args:any) =>
{
    try
    {
        const token = await getToken()
        const response = await axios.patch(BASE_URL+"user",
        {
            fullname: args.fullname,
            profile_picture:args.profile_picture,
            bio: args.bio
        },
        {
            headers:{
                "Content-Type":"multipart/form-data",
                "token":token
            },
        })

        console.log(response.request)
        if(response.status == 200)
        {
            return response.data
        }
        else
        {
            console.log(JSON.stringify(response))
          //  throw Error(JSON.stringify(response.data))
        }
    }
    catch(err:any)
    {
        console.log(JSON.stringify(err))
       // throw Error(JSON.stringify(err))
    }
}