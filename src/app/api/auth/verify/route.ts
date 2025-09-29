import { formatAPIRESPONSE } from '@/lib/api';
import { NextRequest } from 'next/server';
import { verifyToken } from '../../lib/jwt';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return formatAPIRESPONSE({
      data: null,
      error: 'Token is required',
      message: 'Token is required',
      status: 400,
    });
  }

  try {
    await verifyToken(token);
    return formatAPIRESPONSE({
      data: null,
      error: null,
      message: 'Token is valid',
      status: 200,
    });
  } catch (error) {
    return formatAPIRESPONSE({
      data: null,
      error,
      message: 'Invalid token',
      status: 401,
    });
  }
}
