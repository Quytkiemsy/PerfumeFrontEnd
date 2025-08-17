// services/paymentApi.ts

import { QRPaymentRequest, QRPaymentResponse } from "@/app/components/types/payment";
import { sendRequest } from "@/app/util/api";


export const createQRPayment = async (request: QRPaymentRequest): Promise<QRPaymentResponse> => {

    const response = await sendRequest<IBackendRes<QRPaymentResponse>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/create-qr`,
        method: 'POST',
        body: request
    });

    if (response.statusCode !== 200) {
        throw new Error(response.message || "Failed to create QR payment");
    }

    return response.data as QRPaymentResponse;

};
