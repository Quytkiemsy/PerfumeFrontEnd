import { sendRequest } from "@/app/util/api";
import AddressesPage from "@/app/components/profile/addresses.page";
import { getSession } from "@/app/lib/auth/authOptions";
import { redirect } from "next/navigation";

const AddressesPageRoute = async () => {
    const session = await getSession();

    if (!session) {
        redirect('/');
    }

    const res = await sendRequest<IBackendRes<IAddress[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/addresses`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`
        },
        nextOption: {
            next: { tags: ['user-addresses'] }
        }
    });

    const addresses = res?.data || [];

    return <AddressesPage addresses={addresses} />;
};

export default AddressesPageRoute;
