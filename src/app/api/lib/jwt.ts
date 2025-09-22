import jwt from "json-web-token";

// TypeScript interfaces
export interface JWTPayload {
  sub: string;           // User ID (subject)
  iat: number;          // Issued at timestamp
  exp: number;          // Expiration timestamp
  iss: string;          // Issuer (your app name)
  userId: string;       // User identifier
  email: string;        // User email
  fullName: string;     // User's full name
  role: 'user' | 'admin'; // User role
}

export interface UserData {
  userId: string;
  email: string;
  fullName: string;
  role?: 'user' | 'admin';
}

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_ISSUER = 'my-books-app';
const ACCESS_TOKEN_EXPIRATION = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60; // 7 days in seconds

export function encode(userData: UserData): Promise<string> {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    
    const payload: JWTPayload = {
      sub: userData.userId,
      iat: now,
      exp: now + ACCESS_TOKEN_EXPIRATION,
      iss: JWT_ISSUER,
      userId: userData.userId,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role || 'user'
    };

    jwt.encode(JWT_SECRET, payload, 'HS256', (err?: Error, token?: string) => {
      if (err) {
        reject(new Error(`JWT encoding failed: ${err.message}`));
      } else if (!token) {
        reject(new Error('Failed to generate token'));
      } else {
        resolve(token);
      }
    });
  });
}

export function encodeRefreshToken(userData: UserData): Promise<string> {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    
    const payload = {
      sub: userData.userId,
      iat: now,
      exp: now + REFRESH_TOKEN_EXPIRATION,
      iss: JWT_ISSUER,
      type: 'refresh',
      userId: userData.userId,
      email: userData.email
    };

    jwt.encode(JWT_SECRET, payload, 'HS256', (err?: Error, token?: string) => {
      if (err) {
        reject(new Error(`Refresh token encoding failed: ${err.message}`));
      } else if (!token) {
        reject(new Error('Failed to generate refresh token'));
      } else {
        resolve(token);
      }
    });
  });
}

export async function generateTokenPair(userData: UserData): Promise<{accessToken: string, refreshToken: string}> {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      encode(userData),
      encodeRefreshToken(userData)
    ]);
    
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(`Token generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function decode(token: string): Promise<JWTPayload> {
  return new Promise((resolve, reject) => {
    jwt.decode(JWT_SECRET, token, (err?: Error, payload?: any) => {
      if (err) {
        reject(new Error(`JWT decoding failed: ${err.message}`));
      } else if (!payload) {
        reject(new Error('Invalid token payload'));
      } else {
        // Verify token hasn't expired
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          reject(new Error('Token has expired'));
          return;
        }

        // Verify issuer
        if (payload.iss !== JWT_ISSUER) {
          reject(new Error('Invalid token issuer'));
          return;
        }

        resolve(payload as JWTPayload);
      }
    });
  });
}