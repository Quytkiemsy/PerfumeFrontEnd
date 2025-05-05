import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest, response: NextResponse) => {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const filename = searchParams.get('filename');
    return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/images/${filename}`);

};

