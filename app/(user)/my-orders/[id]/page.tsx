import OrderDetailPage from "@/app/components/orders/order.detail";
import { sendRequest } from "@/app/util/api";


interface IOrderProps {
  params: Promise<{ id: string }>
}


const OrderPage: React.FC<IOrderProps> = async ({ params }: IOrderProps) => {
  const { id: orderId } = await params;

  const orderById = await sendRequest<IBackendRes<IOrder>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${orderId}`,
    method: 'GET',
  });


  return (
    <OrderDetailPage order={orderById.data as IOrder} />
  );
};

export default OrderPage;