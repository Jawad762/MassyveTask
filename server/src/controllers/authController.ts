import { Request, Response } from "express";
import User from "../db/models/User";
import bcrypt from 'bcrypt'
import { randomUUID } from "crypto";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import RevokedToken from "../db/models/RevokedToken";
dotenv.config()

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const doesUsernameExist = await User.findOne({ username })

        if (doesUsernameExist) {
            res.status(400).json({ status: 'error', message: 'Username already exists' })
            return
        }

        if (username.length < 3 || username.length > 20) {
            res.status(400).json({ status: 'error', message: 'Username must be between 3 and 20 characters' })
            return
        }

        if (password.length < 6) {
            res.status(400).json({ status: 'error', message: 'Password must be longer than 5 characters' })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const userId = randomUUID()

        const newUser = new User({
            userId,
            username,
            password: hashedPassword
        })
        await newUser.save()

        const payload = {
            userId,
            username
        }

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '10d' })

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            sameSite: 'strict' 
          })
        
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 10 * 24 * 60 * 60 * 1000, 
            sameSite: 'strict'
        })
        
        const user = {
            username,
            userId
        }

        res.status(200).json({ status: 'success', data: { user } })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const existingUser = await User.findOne({ username })

        if (!existingUser) {
            res.status(400).json({ status: 'error', message: 'Incorrect username or password' })
            return
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordCorrect) {
            res.status(400).json({ status: 'error', message: 'Incorrect username or password' })
            return
        }

        const payload = {
            userId: existingUser.userId,
            username
        }

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '10d' })

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            sameSite: 'strict' ,
            secure: false
          })
        
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 10 * 24 * 60 * 60 * 1000, 
            sameSite: 'strict',
            secure: false
        })
        
        const user = {
            username,
            userId: existingUser.userId
        }

        res.status(200).json({ status: 'success', data: { user } })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refresh_token
        if (!refreshToken) {
            res.status(401).json({ status: 'error', message: 'Refresh token not found' })
            return
        }

        const isTokenRevoked = await RevokedToken.findOne({ token: refreshToken })

        if (isTokenRevoked) {
            res.status(401).json({ status: 'error', message: 'Unauthorized' })
            return
        }
        
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { username: string, userId: string } 
        const newPayload = {
            username: payload.username,
            userId: payload.userId
        }
        const newAccessToken = jwt.sign(newPayload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' })
        
        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            sameSite: 'strict' 
        })
        res.status(200).json({ status: 'success', data: { message: 'A new access token has been generated' }})
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')
        // @ts-ignore
        req.user = null
        res.status(200).json({ status: 'success', message: 'logged out succesfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
}