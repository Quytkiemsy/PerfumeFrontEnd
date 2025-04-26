import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

interface IUser {
    _id: string;
    username: string;
    email: string;
    isVerify: boolean;
    type: string;
    role: string;
    image?: string;
}


declare module "next-auth" {

    interface Session {
        accessToken: string;
        refreshToken: string;
        user: IUser & DefaultSession['user']
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        accessToken: string;
        refreshToken: string;
        user: IUser;
    }
}