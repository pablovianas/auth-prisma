import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
    role: string;
    sub: string | (() => string);
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers;

    if(!authHeader.cookie){
        throw new Error("Token is missing");
    }

    const [, token] = authHeader.cookie.split(" ");
    console.log(token);
    try {
        const { sub: user_id, role  } = verify(token, "secret") as JwtPayload;
        req.user = {
            id: Number(user_id),
            role
        }

        return next();
    } catch (error) {
        throw new Error("Invalid token");
    }

}

