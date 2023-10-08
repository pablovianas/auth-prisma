import { Request, Response } from 'express';
import { compare } from 'bcryptjs';
import { prisma } from '../db';
import { sign } from 'jsonwebtoken';

export class SessionController {
    async authentication(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        console.log(user);
        

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const checkIfPasswordMatches = await compare(password, user.password);

        if (!checkIfPasswordMatches) {
            return res.status(400).json({ message: "Incorrect e-mail or password" });
        }


        const newUser: Pick<typeof user, "id" | "name" | "email" | "role"> = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        const token = sign({role: newUser.role}, "secret", {
            subject: String(newUser.id),
            expiresIn: "1d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 3600
        })

        return res.json({ newUser });
    }
}