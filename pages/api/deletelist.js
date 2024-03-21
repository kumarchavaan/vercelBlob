import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const config = { runtime: 'edge' };

export default async function DELETE(request) {
    try{
        const json = await request.json();
        await del(json.url);
        return NextResponse.json({ message: 'file deleted' });
    }catch(err){
        return NextResponse.json({ message: err });
    }
}