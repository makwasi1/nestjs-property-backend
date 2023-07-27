import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dto/auth/user-auth.dto';
import { LoginDto } from 'src/dto/auth/login.dto';
import { access } from 'fs';
import { AuthGuard } from './auth.guard';
import { IResponse } from 'src/interface/reponse.interface';
import { ResponseError, ResponseSuccess } from 'src/dto/response.dto';
import { ResetPasswordDto } from 'src/dto/auth/reset-password.dto';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() registerDto: RegisterDto): Promise<IResponse> {
        try {
            let newUser = await this.authService.register(registerDto);
            await this.authService.createEmailToken(newUser.email);
            let sent = await this.authService.sendEmailVerification(newUser.email);
            
            if (sent) {
                return new ResponseSuccess('User registered successfully', newUser);
            } else {
                return new ResponseError('User not registered', null);
            }

        } catch (error) {
            return new ResponseError('User not registered', error);
        }

    }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Res() response, @Body() loginDto: LoginDto) {
        try {
            let user = await this.authService.login(loginDto.email, loginDto.password);
            return response.status(200).json({
                message: 'Login success',
                user
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error: Invalid credentials!',
                error
            })
        }
    }

    //verify token
    @Get('verify/:token')
    public async verifyEmail(@Param() params): Promise<IResponse> {
        try {
            let isEmailVerified = await this.authService.verifyEmail(params.token);
            return new ResponseSuccess('Email verified successfully', isEmailVerified);
        } catch (error) {
            return new ResponseError('Email not verified', error);
        }
    }

    @Get('resend-verification-email/:email')
    /**
     * sendEmailVerification
@Param()     */
    public async sendEmailVerification(@Param() params): Promise<IResponse> {
        try {
            await this.authService.createEmailToken(params.email);
            let isEmailSent = await this.authService.sendEmailVerification(params.email);
            if (isEmailSent) {
                return new ResponseSuccess('Email verification sent successfully', null);
            } else {
                return new ResponseError('Email verification not sent', null);
            }
        } catch (error) {
            return new ResponseError('Email verification not sent', error);
        }
    }

    @Get('forgot-password/:email')
    public async forgotPassword(@Param() params): Promise<IResponse> {
        try {
            let isEmailSent = await this.authService.sendEmailForgotPassword(params.email);
            if (isEmailSent) {
                return new ResponseSuccess('Email sent successfully', null);
            } else {
                return new ResponseError('Email not sent', null);
            }
        } catch (error) {
            return new ResponseError('Email not sent', error);
        }
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    public async setNewPassword(@Body() resetPassword: ResetPasswordDto): Promise<IResponse> {
        try {
            let isNewPasswordChanged: boolean = false;
            if (resetPassword.email && resetPassword.currentPassword) {
                let isValidPassword = await this.authService.checkPassword(resetPassword.email, resetPassword.currentPassword);
                if (isValidPassword) {
                    isNewPasswordChanged = await this.authService.setPassword(resetPassword.email, resetPassword.newPassword);
                } else {
                    return new ResponseError('Invalid password', null);
                }

            } else if (resetPassword.newPasswordToken) {
                let forgotPasswordModel = await this.authService.getForgottenPasswordModel(resetPassword.newPasswordToken);
                isNewPasswordChanged = await this.authService.setPassword(forgotPasswordModel.email, resetPassword.newPassword);
                if (isNewPasswordChanged) await forgotPasswordModel.remove();
            } else {
                return new ResponseError('Invalid request', null);
            }
            return new ResponseSuccess('Password changed successfully', isNewPasswordChanged);
        }
        catch (error) {
            return new ResponseError('Password not changed', error);
        }
    }

    @UseGuards(AuthGuard)
    @Get('user/profile')
    getProfile() {
        return 'profile';
    }
}
