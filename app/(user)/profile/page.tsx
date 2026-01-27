import { sendRequest } from "@/app/util/api";
import ProfilePage from "@/app/components/profile/profile.page";
import { getSession } from "@/app/lib/auth/authOptions";
import { redirect } from "next/navigation";

const ProfilePageRoute = async () => {
    const session = await getSession();

    if (!session) {
        redirect('/');
    }

    const res = await sendRequest<IBackendRes<IUser>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/profile`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`
        },
        nextOption: {
            next: { tags: ['user-profile'] }
        }
    });

    const user = res?.data as IUser || {
        id: (session?.user as any)?.id || '',
        email: session?.user?.email || '',
        name: session?.user?.name || '',
        role: 'USER' as const,
    };
    console.log('User Profile:', user);

    return <ProfilePage user={user} />;
};

export default ProfilePageRoute;
