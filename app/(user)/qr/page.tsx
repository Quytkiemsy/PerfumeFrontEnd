import QRPayment from '@/app/components/payments/QRPayment';
import React from 'react';

const Page = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Thanh toán QR</h1>
            <QRPayment />
        </div>
    );
}

export default Page;
