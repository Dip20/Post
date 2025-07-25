import { Body, ConflictException, Controller, Post } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./auth.dto";
import { PasswordService } from "./password.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService
    ) { }

    @Post('register')
    async register(@Body() body: RegisterDto) {
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
        const { password, ...rest } = register;
        return {
            message: "Register Successfully",
            data: rest
        }
    }
}