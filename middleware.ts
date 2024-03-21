// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { list } from '@vercel/blob'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/@')) {
    console.log('From middleware',request.nextUrl.pathname)
    let url = request.nextUrl.pathname.substring(2)
    console.log('url',url)
    let bloblist:any = await list();
    console.log('bloblist',bloblist.blobs)
    let filter = bloblist.blobs.filter((blob)=>url == blob.pathname)
    console.log('filter',filter[0])
    if(filter[0]){
        console.log('yupiee')
        return NextResponse.redirect(filter[0].url);
    }

    return NextResponse.next()
  }
}