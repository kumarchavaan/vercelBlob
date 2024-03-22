// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { list } from '@vercel/blob'

export async function middleware(request: NextRequest) {

  if (request.nextUrl.pathname.startsWith('/@')) {
    let url = request.nextUrl.pathname.substring(2)
    let bloblist:any = await list();
    let filter = bloblist.blobs.filter((blob)=>url == blob.pathname)
    
    if(filter[0]){
        return NextResponse.redirect(filter[0].url);
    }

    return NextResponse.next()
  }

}