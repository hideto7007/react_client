// pages/money_management/_middleware.ts

import { NextResponse } from "next/server";

export function middleware(req: { nextUrl: { clone: () => any } }) {
  console.log("Middleware triggered for path:", req.nextUrl);
  const url = req.nextUrl.clone();
  const lowercasePath = url.pathname.toLowerCase();

  if (url.pathname !== lowercasePath) {
    url.pathname = lowercasePath;

    console.log(url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
