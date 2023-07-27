import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/dto/auth/user-auth.dto';
import { IUsers } from 'src/interface/auth.interface';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { jwt_config } from 'src/config';
import { JwtService } from '@nestjs/jwt';
import { ConsentRegistry } from 'src/interface/consentregistry.interface';
import { EmailVerification } from 'src/interface/emailVerification.interface';
import { ForgottenPassword } from 'src/interface/forgottenpassword.interface';
import { log } from 'console';




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

    async checkPassword(email: string, password: string) {
        var userFromDb = await this.userModel.findOne({ email: email });
        if (!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', 404);

        return await bcrypt.compare(password, userFromDb.password);
    }

    async setPassword(email: string, newPassword: string): Promise<boolean> {
        var userFromDb = await this.userModel.findOne({ email: email });
        if (!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', 404);

        userFromDb.password = await bcrypt.hash(newPassword, 10);

        await userFromDb.save();
        return true;
    }

    async verifyEmail(token: string): Promise<boolean> {
        let emailVerif = await this.emailVerificationModel.findOne({ emailToken: token });
        if (emailVerif && emailVerif.email) {
            let userFromDb = await this.userModel.findOne({ email: emailVerif.email });
            if (userFromDb) {
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

    async sendEmailVerification(email: string): Promise<boolean> {
        let model = await this.emailVerificationModel.findOne({ email: email });

        if (model && model.emailToken) {
            console.log('model.emailToken', model.emailToken);
            let transporter = this.emailSetup();
            transporter.verify().then(console.log).catch(console.error);
            // send mail with defined transport object
            let mailOptions = {
                from: '"Aesari Property" <' + + '>',
                to: email, // list of receivers (separated by ,)
                subject: 'Verify Email',
                text: 'Verify Email',
                html: 'Hi! <br><br> Thanks for your registration. Please use this link to verify your account.<br><br>' +
                    '<a href='+'http://localhost:3000/auth/verify/' + model.emailToken + '>Click here to activate your account</a>'  // html body
            };

            let sent = await new Promise<boolean>(async function (resolve, reject) {
                return transporter.sendMail(mailOptions, async (error: any, info: { messageId: any; }) => {
                    if (error) {
                        console.log('Message sent: %s', error);
                        reject(false);
                    }
                    console.log('Message sent: %s', info.messageId);
                    resolve(true);
                })

            })
            return sent;
        } else {
            throw new HttpException('Invalid token', 400);
        }
    }

    private emailSetup() {
        return nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USERNAME, // generated ethereal user
                pass: process.env.SMTP_PASSWORD // generated ethereal password
            }
        });
    }

    async sendEmailForgotPassword(email: string): Promise<boolean> {
        var userFromDb = await this.userModel.findOne({ email: email });
        if (!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', 400);

        var tokenModel = await this.createForgottenPasswordToken(email);

        if (tokenModel && tokenModel.newPasswordToken) {
            let transporter = this.emailSetup();

            let mailOptions = {
                from: '"Company" <' + + '>',
                to: email, // list of receivers (separated by ,)
                subject: 'Frogotten Password',
                text: 'Forgot Password',
                html: 'Hi! <br><br> If you requested to reset your password<br><br>' +
                    '<a href='+'http://localhost:3000/auth/reset-password/' + tokenModel.newPasswordToken + '>Click here</a>'  // html body
            };

            var sent = await new Promise<boolean>(async function (resolve, reject) {
                return transporter.sendMail(mailOptions, async (error: any, info: { messageId: any; }) => {
                    if (error) {
                        console.log('Message sent: %s', error);
                        return reject(false);
                    }
                    console.log('Message sent: %s', info.messageId);
                    resolve(true);
                });
            })

            return sent;
        } else {
            throw new HttpException('REGISTER.USER_NOT_REGISTERED', 404);
        }
    }



}
