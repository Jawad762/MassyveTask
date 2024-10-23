import { Request, Response } from "express";
import User from "../db/models/User";
import { IUser } from "../types/types";

export const getUser = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = req.user as IUser;

        if (!user) {
            res.status(401).json({ status: 'error', message: 'Unauthorized: No user found' });
            return
        }

        const userInfo = await User.findOne({ userId: user.userId });

        if (!userInfo) {
            res.status(404).json({ status: 'error', message: 'User not found' });
            return
        }

        res.status(200).json({ status: 'success', data: userInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
};
