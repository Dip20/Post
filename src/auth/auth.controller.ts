import { Body, ConflictException, Controller, HttpException, InternalServerErrorException, Post, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto, RegisterDto } from "./auth.dto";
import { PasswordService } from "./password.service";
import { JwtAuthService } from "./jwt.service";
import { first } from "rxjs";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtAuthService
    ) { }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        try {
            // check same username already exist or not
            const user: any = await this.prisma.users.findFirst({
                where: {
                    email: {
                        contains: body.email,
                        mode: 'insensitive'
                    }
                }
            });

            if (user) {
                throw new ConflictException('User already exist')
            }

            const salt = this.passwordService.generateSalt();
            const hash = await this.passwordService.hash(body.password, salt);
            const register: any = await this.prisma.users.create({
                data: {
                    firstname: body.firstname,
                    lastname: body.lastname,
                    email: body.email,
                    password: hash,
                    salt
                }
            });

            return {
                message: "Register Successfully",
                data: {
                    id: register.id,
                    firstname: register.firstname,
                    lastname: register.lastname,
                    email: register.email
                }
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Something went wrong');
        }
    }


    @Post('login')
    async login(@Body() body: LoginDto) {
        try {
            // find user by email
            const user: any = await this.prisma.users.findFirst({
                where: {
                    email: {
                        equals: body.email,
                        mode: 'insensitive',
                    },
                },
            });

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            // hash the password
            const hash = await this.passwordService.hash(body.password, user.salt);

            // verify password
            const isPasswordValid = await this.passwordService.compare(
                body.password,
                hash,
                user.salt
            );

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid email or password');
            }

            // generate JWT token
            const token = await this.jwtService.signToken({
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            });

            //expire old tokens (assume only single platform as of now)
            await this.prisma.tokens.updateMany({
                where: {
                    userId: user.id,
                },
                data: {
                    isExpired: true,
                    expireAt: new Date(),
                },
            });

            const expireAt:any = new Date(this.jwtService.getTokenExpiration(token) as any);
            await this.prisma.tokens.create({
                data: {
                    token,
                    userId: user.id,
                    expireAt,
                },
            });


            return {
                message: 'Login successful',
                data: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    token,
                },
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Something went wrong');
        }
    }
}