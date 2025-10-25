import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthService {
    constructor(
        private readonly jwtService: NestJwtService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Generate JWT token for a user
     * @param payload - The payload to sign (usually contains userId, email, etc.)
     * @returns A promise that resolves to the signed JWT token
     */
    async signToken(payload: any) {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_SECRET', 'secretKey@^%123456789'),
            expiresIn: this.configService.get<string | number>('JWT_EXPIRES_IN', '1d') as any,
        });
    }

    /**
     * Verify a JWT token
     * @param token - The JWT token to verify
     * @returns A promise that resolves to the decoded token payload or null if invalid
     */
    async verifyToken(token: string): Promise<any | null> {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET', 'secretKey@^%123456789'),
            });
        } catch (error) {
            return null;
        }
    }

    /**
     * Decode a JWT token without verification
     * @param token - The JWT token to decode
     * @returns The decoded token payload or null if invalid
     */
    decodeToken(token: string): any | null {
        try {
            return this.jwtService.decode(token);
        } catch (error) {
            return null;
        }
    }

    /**
     * Get the expiration time of a token
     * @param token - The JWT token
     * @returns The expiration timestamp in seconds or null if invalid
     */
    getTokenExpiration(token: string): number | null {
        const decoded = this.decodeToken(token);
        return decoded?.exp || null;
    }


    /**
     * Get the expiration time of a token
     * @param token - The JWT token
     * @returns The expiration timestamp in seconds or null if invalid
     */
    async getTokenExpiry(token: string): Promise<Date | null> {
        try {
            // Decode token without verifying signature
            const decoded = this.jwtService.decode(token) as { exp?: number } | null;

            if (!decoded?.exp) return null;

            // Convert expiry timestamp (in seconds) to Date
            const expireAt = new Date(decoded.exp * 1000);
            return expireAt;
        } catch (err) {
            console.error('Error decoding token:', err);
            return null;
        }
    }
}
