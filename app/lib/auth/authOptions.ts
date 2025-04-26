
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

                // 🛡️ Fake logic, thay bằng check DB thực tế
                if (username === "admin@example.com" && password === "123456") {
                    return { id: "1", name: "Admin", username };
                }

                return null;
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