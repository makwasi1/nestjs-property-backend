import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dto/auth/user-auth.dto';
import { LoginDto } from 'src/dto/auth/login.dto';
import { access } from 'fs';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Res() response, @Body() registerDto:  RegisterDto) {
        try {
            const newUser = await this.authService.register(registerDto);
            return response.status(200).json({
                message: 'User registered successfully',
                newUser
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error: User not registered!',
                error
            })
        }
    
    }

    @Post('login')
    async login(@Res() response, @Body() loginDto: LoginDto) {
        try {
            const user = await this.authService.login(loginDto.email, loginDto.password);
            console.log("user", user);
            return response.status(200).json({
                message: 'Login success',
                access_token: user.access_token
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error: Invalid credentials!',
                error
            })
        }
    }
}
