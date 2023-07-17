import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/dto/auth/user-auth.dto';
import { IUsers } from 'src/interface/auth.interface';
import * as bcrypt from 'bcrypt';
import { jwt_config } from 'src/config';
import { JwtService } from '@nestjs/jwt';




@Injectable()
export class AuthService {
    constructor(@InjectModel('user') private userModel: Model<IUsers>, private jwtService: JwtService) { }

    async register(registerDto: RegisterDto): Promise<IUsers> {
        // TODO: create repository for user
        const checkUserExists = await this.userModel.findOne({ email: registerDto.email });

        if (checkUserExists) {
            throw new HttpException('User already exists', 400);
        }
        registerDto.password = await bcrypt.hash(registerDto.password, 10);
        const createUser = new this.userModel(registerDto);
        return createUser.save();
    }

    async login(email: string, password: string): Promise<any> {
        const checkUserExists = await this.userModel.findOne({ email: email });
    
        if (!checkUserExists) {
            throw new HttpException('User not found', 404);
        }
    
        const result = await bcrypt.compare(password, checkUserExists.password);
    
        if (result) {
            const payload = { username: checkUserExists.name, sub: checkUserExists._id };
            return {
                statusCode: 200,
                message: 'Login success',
                accessToken: this.generateJWT(payload),
            };
        } else {
            throw new HttpException('Invalid credentials', 401);
        }
    }
    //generate access token

    generateJWT(payload: any) {
        try {
            //retun the token
            return this.jwtService.sign(payload);
        } catch (error) {
            throw new HttpException('Invalid credentials', 401);
        }
    }

}
