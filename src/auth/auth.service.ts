import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/dto/auth/user-auth.dto';
import { IUsers } from 'src/interface/auth.interface';
import * as bcrypt from 'bcrypt';
import { jwt_config } from 'src/config';
import { log } from 'console';


@Injectable()
export class AuthService {
    jwtService: any;
    constructor(@InjectModel('user') private userModel: Model<IUsers>) {}

    async register(registerDto: RegisterDto): Promise<IUsers> {
        // TODO: create repository for user
        const checkUserExists = await this.userModel.findOne({email: registerDto.email});

        if(checkUserExists) {
            throw new HttpException('User already exists', 400);
        }
        registerDto.password =  await bcrypt.hash(registerDto.password, 10);
        const createUser = new this.userModel(registerDto);
        return createUser.save();
    }

    async login(email: string, password: string): Promise<any> {
        const checkUserExists = await this.userModel.findOne({email: email});

        if(!checkUserExists) {
            throw new HttpException('User not found', 404);
        }

        const checkPassword = await bcrypt.compare(password, (checkUserExists.password).toString());
        
        if(!checkPassword) {    
            throw new HttpException('Invalid credentials', 401);
        } else {
            console.log("pass", checkUserExists._id);
            const accessToken =  this.generateJWT({
                sub: checkUserExists._id,
                email: checkUserExists.email,
                name: checkUserExists.name,
            });

            console.log("accessToken", accessToken);

            return {
                statusCode: 200,
                message: 'Login success',
                // accessToken: accessToken,
            }
        }
    }

    generateJWT(payload: any) {
        return this.jwtService.sign(payload, {
            secret: jwt_config.secret,
            expiresIn: jwt_config.expired,
        });
    }

}
