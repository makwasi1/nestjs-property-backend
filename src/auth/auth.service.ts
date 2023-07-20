import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/dto/auth/user-auth.dto';
import { IUsers } from 'src/interface/auth.interface';
import * as bcrypt from 'bcrypt';
import { jwt_config } from 'src/config';
import { JwtService } from '@nestjs/jwt';
import { ConsentRegistry } from 'src/interface/consentregistry.interface';
import { EmailVerification } from 'src/interface/emailVerification.interface';
import { ForgottenPassword } from 'src/interface/forgottenpassword.interface';




@Injectable()
export class AuthService {
    constructor(@InjectModel('user') private userModel: Model<IUsers>,
        @InjectModel('EmailVerification') private readonly emailVerificationModel: Model<EmailVerification>,
        @InjectModel('ForgottenPassword') private readonly forgottenPasswordModel: Model<ForgottenPassword>,
        @InjectModel('ConsentRegistry') private readonly consentRegistryModel: Model<ConsentRegistry>,
        private jwtService: JwtService) { }

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

    async createEmailToken(email: string): Promise<boolean> {
        let emailVerification = await this.emailVerificationModel.findOne({ email: email });
        if (emailVerification && ((new Date().getTime() - emailVerification.timestamp.getTime()) / 60000 < 15)) {
            throw new HttpException('Email already sent', 400);
        } else {
            let emailVerificationModel = await this.emailVerificationModel.findOneAndUpdate({
                email: email
            },
                {
                    email: email,
                    emailToken: (Math.floor(Math.random() * (9000000)) + 1000000).toString(), //Generate 7 digits number,
                    timestamp: new Date()
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
        return true;
    }

    //create forgotten password token
    async createForgottenPasswordToken(email: string): Promise<ForgottenPassword> {
        let forgottenpassword = await this.forgottenPasswordModel.findOne({
            email: email
        });
        if (forgottenpassword && ((new Date().getTime() - forgottenpassword.timestamp.getTime()) / 60000 < 15)) {
            throw new HttpException('Email already sent', 400);
        } else {
            let forgottenPassword = await this.forgottenPasswordModel.findOneAndUpdate({
                email: email
            },
            {
                email: email,
                newPasswordToken: (Math.floor(Math.random() * (9000000)) + 1000000).toString(), //Generate 7 digits number,
                timestamp: new Date()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            if (forgottenPassword) {
                return forgottenPassword;
            } else {
                throw new HttpException('Email not sent', 400);
            }
        }
    }

    async verifyEmail(token: string): Promise<boolean> {
        let emailVerif = await this.emailVerificationModel.findOne({emailToken: token});
        if(emailVerif && emailVerif.email) {
            let userFromDb = await this.userModel.findOne({email: emailVerif.email});
            if(userFromDb) {
               return true; //TODO: update user emailVerified to true
            }
        } else {
            throw new HttpException('Invalid token', 400);
        }
    }

    async getForgottenPasswordModel(newPasswordToken: string): Promise<ForgottenPassword> {
        let forgottenPassword = await this.forgottenPasswordModel.findOne({ newPasswordToken: newPasswordToken });
        if (forgottenPassword) {
            return forgottenPassword;
        } else {
            throw new HttpException('Invalid token', 400);
        }
    }

    

}
