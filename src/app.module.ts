import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsSchema } from './schema/student.schema';
import { StudentService } from './service/student/student.service';
import { StudentController } from './controller/student/student.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UsersSchema } from './schema/user.schema';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwt_config } from './config';
import { JwtStrategy } from './auth/jwt-strategy';

const databaseUrl = 'mongodb+srv://makwasi:makwasi@cluster0.1zrjxib.mongodb.net/?retryWrites=true&w=majority';
@Module({
  imports: [
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
    MongooseModule.forFeature([{ name: 'nest' , schema: StudentsSchema},{name: 'user', schema: UsersSchema}]),
     
  ],
  controllers: [AppController, StudentController, AuthController],
  providers: [AppService, StudentService, AuthService, JwtStrategy],
})
export class AppModule { }
