import jwt from "jsonwebtoken";
import { Request } from "express";

export interface DecodedToken {
    userId: string;
    iat: number;
}

export interface UserContext {
    userId: string
}

export const verifyToken = (token: string) => {
    try {
        const decodedToken: DecodedToken = jwt.verify(token, process.env.TOKEN_SECRET || "") as DecodedToken
        return { success: true, userId: decodedToken.userId };
    } catch (error) {
        return { success: false, error: "Invalid token" };
    }
};
export interface CustomRequest<T = Record<string, any>> extends Request {
    userId?: string;
    customData?: T;
}

export interface AuthContext<> {
    req: CustomRequest
}
export const verifyRequest = async (context: AuthContext) => {
    const token = context.req.header("token")
    if (!token) {
        throw Error("Token is not provided")
    }
    const decodedToken = verifyToken(token)
    if (decodedToken.success) {
        return decodedToken.userId || ""
    }
    else {
        throw Error("Token is not provided")
    }
}
