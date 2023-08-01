import { Body, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { LoggingInterceptor } from 'src/commons/interceptors/logging.interceptors';
import { TransformInterceptor } from 'src/commons/interceptors/transform.interceptors';
import { Roles } from 'src/commons/decorators/roles.decorate';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { IResponse } from 'src/interface/reponse.interface';
import { ResponseError, ResponseSuccess } from 'src/dto/response.dto';
import { UserDto } from './dto/user.dto';
import { ProfileDto } from './dto/profile.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('user/:email')
    @UseGuards(RolesGuard)
    @Roles('User')
    async findById(@Param() params): Promise<IResponse> {
        try {
            let user = await this.userService.findByEmail(params.email);
            return new ResponseSuccess("USER.FOUND", new UserDto(user))
        } catch (error) {
            return new ResponseSuccess("USER.NOT_FOUND", error)
        }
    }

    @Put('profile/update')
    // @UseGuards(RolesGuard)
    @Roles('User')
    async updateProfile(@Body() profileDto: ProfileDto): Promise<IResponse> {
        console.log(profileDto);
        try {
            var user = await this.userService.updateProfile(profileDto);
            return new ResponseSuccess("PROFILE.UPDATE_SUCCESS", new UserDto(user));
        } catch (error) {
            return new ResponseError("PROFILE.UPDATE_ERROR", error);
        }
    }
}
