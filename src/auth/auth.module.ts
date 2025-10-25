import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
import { JwtAuthService } from './jwt.service';

/**
 * AuthModule is responsible for managing authentication-related operations.
 * It includes controllers and services for handling authentication requests.
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'secretKey@^%123456789'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_EXPIRES_IN', '7d') as string | number,
        },
      }) as any,
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [
    PasswordService,
    JwtAuthService,
  ],
  controllers: [AuthController],
  exports: [JwtAuthService],
})
export class AuthModule { }
