
import { IsNotEmpty, IsString, MinLength, MaxLength, Matches, IsEmail } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    firstname: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    lastname: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(30)
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    // add regex
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
    password: string;
}


export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    // add regex
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
    password: string;
}
