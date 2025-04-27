
import { AuthOptions, getServerSession } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import { sendRequest } from "@/app/util/api"


const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        CredentialsProvider({
            name: "The Perfume",
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {
                const { username, password } = credentials as {
                    username: string;
                    password: string;
                };

                // Add logic here to look up the user from the credentials supplied
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                    method: 'POST',
                    body: { username: credentials?.username, password: credentials?.password }
                });

                if (res.data) {
                    // Any object returned will be saved in `user` property of the JWT
                    return res.data as any;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    // Trả về lỗi khi thông tin đăng nhập sai
                    throw new Error(res.message);

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {
            if (trigger === 'signIn' && account?.provider === 'github') {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-media`,
                    method: 'POST',
                    body: { typeOfLogin: "GITHUB", username: user.email }
                });
                if (res.data) {
                    token.accessToken = res.data?.accessToken;
                    token.refreshToken = res.data.refreshToken;
                    token.user = res.data.user;
                    token.user.image = user?.image as string;
                }
            }

            if (trigger === 'signIn' && account?.provider === 'google') {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-media`,
                    method: 'POST',
                    body: { typeOfLogin: "google", username: user.email }
                });
                if (res.data) {
                    token.accessToken = res.data?.accessToken;
                    token.refreshToken = res.data.refreshToken;
                    token.user = res.data.user;
                    token.user.image = user?.image as string;
                }
            }

            if (trigger === 'signIn' && account?.provider === 'credentials') {

                if (user) {
                    //@ts-ignore
                    token.accessToken = user?.accessToken;
                    //@ts-ignore
                    token.refreshToken = user?.refreshToken;
                    //@ts-ignore
                    token.user = user?.user;
                }
            }
            return token;
        },
        // sau khi modify cái token thì nạp ngược lại cho session
        //@ts-ignore
        session({ session, token, user, req, res }) {
            session.user = token.user
            session.accessToken = token.accessToken
            session.refreshToken = token.refreshToken
            return session
        },
    }
}



/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }