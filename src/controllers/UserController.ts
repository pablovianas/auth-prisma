import { Request, Response } from "express";

import { prisma } from "../db";
import { hash } from "bcryptjs";

type User = {
    name: string;
    email: string;
    password: string;
}

export class UserController {

    async createUser(req: Request, res: Response) {
        const { name, email, password }: User = req.body;

        const checkIfUserExists = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (checkIfUserExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword: string = await hash(password, 8);

        console.log(hashPassword);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword
            }
        });

        return res.status(201).json();
    }
} 