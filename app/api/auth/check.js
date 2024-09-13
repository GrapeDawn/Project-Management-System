// pages/api/auth/check.js

import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function GET(request) {
  const token = request.cookies.get('OutsideJWT')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET || "";
    verify(token, secret);
    return NextResponse.json({ message: 'Authenticated' });
  } catch (e) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
