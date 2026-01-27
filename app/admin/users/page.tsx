import { sendRequest } from "@/app/util/api";
import ManageUsers from "@/app/components/admin/manage.users";
import { getSession } from "@/app/lib/auth/authOptions";

const AdminUsersPage = async () => {
    const session = await getSession();

    const res = await sendRequest<IBackendRes<IModelPaginate<IUser>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`
        },
        queryParams: {
            page: 1,
            pageSize: 100
        },
        nextOption: {
            next: { tags: ['admin-users'] }
        }
    });

    const users = res?.data?.result || [];

    return <ManageUsers users={users} />;
};

export default AdminUsersPage;
