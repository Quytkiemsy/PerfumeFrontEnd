import QRPayment from '@/app/components/payments/QRPayment';
import { sendRequest } from '@/app/util/api';
import { redirect } from "next/navigation";

interface IPaymentProps {
    params: Promise<{ id: string }>
}

const PaymentPage: React.FC<IPaymentProps> = async ({ params }: IPaymentProps) => {
    const { id: orderId } = await params;
    const orderById = await sendRequest<IBackendRes<IOrder>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${orderId}`,
        method: 'GET',
    });

    if (orderById.data) {
        if (orderById.data.status === 'PENDING' && orderById.data.paymentMethod === 'BANK') {
            return (
                <div>
                    <QRPayment order={orderById.data as IOrder} />
                </div>
            );
        }
    }
    redirect("/my-orders"); // Điều hướng server-side


}

export default PaymentPage;
