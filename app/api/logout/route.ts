import { sendRequest } from '@/app/util/api';
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/lib/auth/authOptions';

export const POST = async (request: NextRequest) => {
    const session = await getServerSession(authOptions);
    await sendRequest<void>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
    });
    return Response.json({});

};

