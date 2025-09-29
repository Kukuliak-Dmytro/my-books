import { formatAPIRESPONSE } from '@/lib/api';
import { NextRequest } from 'next/server';
import { registerUser } from '../../lib/auth';
import { generateTokenPair } from '../../lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, password } = body;

    if (!full_name || !email || !password) {
      return formatAPIRESPONSE({
        data: null,
        error: 'All fields are required',
        message: 'All fields are required',
        status: 400,
      });
    }

    // Register the user and get user data
    const user = await registerUser(full_name, email, password);

    // Generate JWT tokens
    const { accessToken, refreshToken } = await generateTokenPair({
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      role: 'user',
    });

    return formatAPIRESPONSE({
      data: {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: 'user',
        },
        accessToken,
        refreshToken,
      },
      error: null,
      message: 'User registered successfully',
      status: 201,
    });
  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific database errors
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return formatAPIRESPONSE({
        data: null,
        error,
        message: 'User with this email already exists',
        status: 409,
      });
    }

    return formatAPIRESPONSE({
      data: null,
      error,
      message: 'Internal server error',
      status: 500,
    });
  }
}