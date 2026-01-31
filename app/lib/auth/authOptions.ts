import { sendRequest } from "@/app/util/api"
import dayjs, { ManipulateType } from "dayjs"
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
                    token.expiresAt = dayjs(new Date()).add(+(res.data.expiresIn as string) - 10,
                        ('second' as ManipulateType)).unix()
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
                    token.expiresAt = dayjs(new Date()).add(+(res.data.expiresIn as string) - 10,
                        ('second' as ManipulateType)).unix()
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
                    token.expiresAt = dayjs(new Date()).add(+(user.expiresIn as string) - 10,
                        ('second' as ManipulateType)).unix()
                    console.log(">>> User logged in with role:", token.user?.role);
                }
            }
            console.log(">>> old token ", token?.refreshToken?.slice(-4), " time", new Date().toISOString());
            // Sửa lỗi cú pháp và logic kiểm tra hạn token
            const isTimeAfter = dayjs().isAfter(dayjs.unix((token?.expiresAt as number ?? 0)));
            if (!isTimeAfter) {
                return token;
            }
            const newToken = await refreshAccessToken(token);
            console.log(">>> new token ", newToken?.refreshToken?.slice(-4));
            return {
                ...token,
                ...newToken,
                refreshToken: newToken.refreshToken ?? token.refreshToken, // luôn ưu tiên refreshToken mới
            };

        },
        // sau khi modify cái token thì nạp ngược lại cho session
        //@ts-ignore
        session({ session, token, user, req, res }) {
            session.user = token.user
            session.accessToken = token.accessToken
            session.refreshToken = token.refreshToken
            session.error = token.error as string
            console.log(">>> Session created with user role:", session.user?.role);
            return session
        },
    }
}

// Lock to prevent concurrent refreshAccessToken calls
let refreshPromise: Promise<JWT> | null = null;

async function refreshAccessToken(token: JWT) {
    // Nếu đã có refreshPromise đang chạy, chờ nó xong rồi trả kết quả
    if (refreshPromise) {
        console.log('>>> Waiting for ongoing refreshAccessToken...');
        return refreshPromise;
    }
    // Tạo promise mới cho lần refresh này
    refreshPromise = (async () => {
        try {
            const res = await sendRequest<IBackendRes<JWT>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/account/refresh`,
                method: "POST",
                body: { refreshToken: token?.refreshToken },
            });
            if (res.data) {
                console.log(">>> refresh token success");
                const updatedUser = res.data?.user ?? token.user;
                console.log(">>> User role after refresh:", updatedUser?.role);
                return {
                    ...token,
                    accessToken: res.data?.accessToken,
                    refreshToken: res.data?.refreshToken ?? token.refreshToken, // fallback về token cũ nếu không có mới
                    user: updatedUser,
                    expiresAt: dayjs(new Date()).add(+(res.data.expiresIn as string) - 10,
                        ('second' as ManipulateType)).unix(),
                    error: "",
                };
            } else {
                console.log(">>> refresh token failed");
                return {
                    ...token,
                    error: "RefreshAccessTokenError"
                };
            }
        } finally {
            // Đảm bảo luôn reset lock sau khi xong
            refreshPromise = null;
        }
    })();
    return refreshPromise;
}


/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }

