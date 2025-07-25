import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

/**
 * AuthModule is responsible for managing authentication-related operations.
 * It includes controllers for handling authentication requests.
 */
@Module({
    imports: [],        
    providers: [],
    controllers: [AuthController],
    exports: [],
})
export class AuthModule { }
