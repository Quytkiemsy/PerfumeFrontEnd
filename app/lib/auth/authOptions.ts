
import { sendRequest } from "@/app/util/api"
import { AuthOptions, getServerSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"


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
                    token.expiresAt = typeof res.data.expiresIn === 'number'
                        ? Math.floor(Date.now() / 1000 + res.data.expiresIn - 10) // trừ đi 20 giây để tránh trường hợp token hết hạn trước khi sử dụng
                        : Math.floor(Date.now() / 1000 + 3600);
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
                    token.expiresAt = typeof res.data.expiresIn === 'number'
                        ? Math.floor(Date.now() / 1000 + res.data.expiresIn - 10) // trừ đi 20 giây để tránh trường hợp token hết hạn trước khi sử dụng
                        : Math.floor(Date.now() / 1000 + 3600);
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
                    //@ts-ignore
                    token.expiresAt = typeof user.expiresIn === 'number'
                        //@ts-ignore
                        ? Math.floor(Date.now() / 1000 + user?.expiresIn - 10)
                        : Math.floor(Date.now() / 1000 + 3600);
                }
            }

            if (Date.now() < token.expiresAt! * 1000) {
                return token;
            }
            if ((token as any).hasRefreshed && Date.now() < token.expiresAt! * 1000) {
                return token;
            }
            const newToken = await refreshAccessToken(token);
            return {
                ...newToken,
                hasRefreshed: true
            };

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

async function refreshAccessToken(token: JWT) {

    const res = await sendRequest<IBackendRes<JWT>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/account/refresh`,
        method: "POST",
        body: { refreshToken: token?.refreshToken },
    })

    if (res.data) {
        console.log(">>> refresh token success")

        return {
            ...token,
            accessToken: res.data?.accessToken,
            refreshToken: res.data?.refreshToken,
            user: res.data?.user ?? token.user,
            expiresAt: typeof res.data.expiresIn === 'number'
                ? Math.floor(Date.now() / 1000 + res.data.expiresIn - 10) // trừ đi 10 giây để tránh trường hợp token hết hạn trước khi sử dụng
                : Math.floor(Date.now() / 1000 + 3600),
            error: "",
        }
    } else {
        console.log(">>> refresh token failed")
        //failed to refresh token => do nothing
        return {
            ...token,
            error: "RefreshAccessTokenError", // This is used in the front-end, and if present, we can force a re-login, or similar
        }
    }
}


/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }
