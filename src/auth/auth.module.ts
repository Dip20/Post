import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';

/**
 * AuthModule is responsible for managing authentication-related operations.
 * It includes controllers for handling authentication requests.
 */
@Module({
    imports: [],        
    providers: [PasswordService],
    controllers: [AuthController],
})
export class AuthModule { }
