import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from "../globals/constants";
import { SignUpArgsType } from "../types/User";

export const loginUser = async(email:string,password:string) =>
{
    try{
        email = email.toLowerCase()
        const response = await axios.post(
            `${BASE_URL}login`,
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
          );
        
          return response.data;
    }
    catch(error:any)
    {
        throw "Error"+error?.response?.data;
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
        return response.data
    }
    catch(error:any)
    {
        throw error?.response?.data;
    }
}