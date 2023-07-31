import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertySchema } from './schema/property.schema';
import { PropertyService } from './service/student/property.service';
import { PropertyController} from './controller/property/property.controller';
import { AuthController } from './auth/auth.controller';
import { UserSchema } from './schema/user.schema';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwt_config } from './config';
import { JwtStrategy } from './auth/jwt-strategy';
import { EmailVerificationSchema } from './schema/emailVerification.schema';
import { ForgottenPasswordSchema } from './schema/forgottenpassword.schema';
import { ConsentRegistrySchema } from './schema/consentregistry.schema';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';

const databaseUrl = 'mongodb+srv://makwasi:makwasi@cluster0.1zrjxib.mongodb.net/?retryWrites=true&w=majority';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    // AuthModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false
    }),
    JwtModule.register({
      secret: jwt_config.secret,
      signOptions: {
        expiresIn: jwt_config.expired
      }
    }),
    MongooseModule.forRoot('mongodb+srv://makwasi:makwasi@cluster0.1zrjxib.mongodb.net/?retryWrites=true&w=majority'),
    MongooseModule.forFeature([{ name: 'property', schema: PropertySchema }, 
    { name: 'user', schema: UserSchema },
    { name: 'EmailVerification', schema: EmailVerificationSchema },
    { name: 'ForgottenPassword', schema: ForgottenPasswordSchema },
    { name: 'ConsentRegistry', schema: ConsentRegistrySchema }]),
    UserModule,
    PaymentsModule
  ],
  controllers: [AppController, PropertyController, AuthController],
  providers: [AppService, PropertyService, AuthService, JwtStrategy],
})
export class AppModule { }
