import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use an environment variable for production
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

const validUsers = [
  {
    email: 'admin@crm',
    password: '123',
    role: 'admin'
  },
  {
    email: 'student@crm',
    password: '123',
    role: 'student'
  },
  {
    email: 'guide@crm',
    password: '123',
    role: 'guide'
  },
];

export async function POST(req) {
  const { email, password } = await req.json();

  // Find the user with matching email and password
  const user = validUsers.find((user) => user.email === email && user.password === password);

  if (user) {
    // Create JWT token using HS256 algorithm and include the user's role
    const token = jwt.sign({ email, role: user.role }, JWT_SECRET, { expiresIn: MAX_AGE, algorithm: 'HS256' });

    // Set token as HTTP-only cookie
    const cookie = serialize('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: MAX_AGE,
      path: '/',
    });

    const response = NextResponse.json({ message: 'Login successful', role: user.role });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } else {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }
}