import { NextRequest, NextResponse } from "next/server";
import { verifyToken, generateTokenPair } from "../../lib/jwt";
import { formatAPIRESPONSE } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { refreshToken } = body;

        if (!refreshToken) {
            return formatAPIRESPONSE({
                data: null,
                error: "Missing refresh token",
                message: 'Refresh token is required',
                status: 400,
            });
        }

        // Verify refresh token
        let payload;
        try {
            payload = await verifyToken(refreshToken);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Token verification failed';
            console.log('❌ Refresh token verification failed:', errorMessage);
            
            return formatAPIRESPONSE({
                data: null,
                error: "Invalid refresh token",
                message: 'Refresh token is invalid or expired. Please log in again.',
                status: 401,
            });
        }

        // Check if this is actually a refresh token
        if (!payload || (payload as any).type !== 'refresh') {
            return formatAPIRESPONSE({
                data: null,
                error: "Invalid token type",
                message: 'Invalid refresh token type',
                status: 401,
            });
        }

        // Generate new token pair
        const newTokens = await generateTokenPair({
            userId: payload.userId,
            email: payload.email,
            fullName: payload.fullName,
            role: payload.role
        });

        return formatAPIRESPONSE({
            data: {
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
                user: {
                    userId: payload.userId,
                    email: payload.email,
                    fullName: payload.fullName,
                    role: payload.role
                }
            },
            error: null,
            message: 'Tokens refreshed successfully',
            status: 200,
        });

    } catch (error: unknown) {
        console.error("Error refreshing tokens:", error);
        return formatAPIRESPONSE({
            data: null,
            error: "Failed to refresh tokens",
            message: error instanceof Error ? error.message : 'Unknown error',
            status: 500,
        });
    }
}