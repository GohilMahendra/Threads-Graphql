import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from "../globals/constants";

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
      
          // You may want to throw the error again or handle it according to your needs
          throw error?.response?.data;
    }

}