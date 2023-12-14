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
            return res.status(401).json({
                message:"unauthorised Access!"
            })
        }
        const decodedToken = verifyToken(token)
        if(decodedToken.success)
        {
            req.userId = decodedToken.userId
            next()
        }
        else 
        {
            return res.status(401).json({
                message:"invalid token supplied"
            })
        }
    }
    catch(err)
    {
        return res.status(500).json({
            message:"Internal server Error"
        })
    }
}
