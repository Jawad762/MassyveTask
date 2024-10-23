import { Document } from "mongoose"

export interface IUser {
    username: string
    password: string
    userId: string
}

export interface IDocument extends Document {
    _doc: any
}