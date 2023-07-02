import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/firebase/clientApp";
// Limit the middleware to paths starting with `/admin/`
export const config = {
    matcher: '/admin/:function*',
}

export async function middleware(request: NextRequest) {
    let isAdmin = request.cookies.get("isAdmin");
    console.log("isAdmin", isAdmin)
    if (isAdmin) {
        console.log("you are admin")
    } else {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'get token error' }),
            { status: 401, headers: { 'content-type': 'application/json' } }
        )
    }


}