import jwt from "jsonwebtoken";
import { Response,Request,NextFunction } from "express";

interface DecodedToken {
    userId: string;
    iat: number;
}

const verifyToken = (token: string) => {
    try {
        const decodedToken:DecodedToken = jwt.verify(token, process.env.TOKEN_SECRET || "") as DecodedToken
        return { success: true, userId: decodedToken.userId };
    } catch (error) {
        return { success: false, error: "Invalid token" };
    }
};
export interface CustomRequest<T = Record<string, any>> extends Request {
    userId?: string;
    customData?: T;
}
export const verifyRequest = async(req:CustomRequest,res:Response,next:NextFunction)=>
{
    try
    {
        const token = req.header("token")
        if(!token)
        {
           throw Error("Token is not provided")
        }
        const decodedToken = verifyToken(token)
        if(decodedToken.success)
        {
            req.userId = decodedToken.userId || ""
            next()
        }
        else 
        {
            throw Error("Token is not provided")
        }
    }
    catch(err)
    {
        throw Error("Interal sevrer Error")
    }
}
