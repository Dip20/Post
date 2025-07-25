import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class PasswordService {
    private readonly pepper = process.env.ENCRYPTION_KEY ?? '';

    generateSalt(): string {
        return randomBytes(16).toString('hex');
    }

    async hash(password: string, salt: string): Promise<string> {
        const combined = password + salt + this.pepper;
        return await bcrypt.hash(combined, 10);
    }

    async compare(password: string, salt: string, hash: string): Promise<boolean> {
        const combined = password + salt + this.pepper;
        return await bcrypt.compare(combined, hash);
    }
}
