import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ProfileDto } from './dto/profile.dto';
import { PhotoDto } from 'src/commons/photo.dto';
import { SettingsDto } from './dto/settings.dto';


const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>) { }


  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async createNewUser(newUser: CreateUserDto): Promise<User> {
    if (this.isValidEmail(newUser.email) && newUser.password) {
      var userRegistered = await this.findByEmail(newUser.email);
      if (!userRegistered) {
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);
        var createdUser = new this.userModel(newUser);
        createdUser.roles = ["User"];
        return await createdUser.save();
      } else if (!userRegistered.auth.email.valid) {
        return userRegistered;
      } else {
        throw new HttpException('REGISTRATION.USER_ALREADY_REGISTERED', 400);
      }
    } else {
      throw new HttpException('REGISTRATION.MISSING_MANDATORY_PARAMETERS', 400);
    }

  }

  isValidEmail(email: string) {
    if (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false
  }

  async setPassword(email: string, newPassword: string): Promise<boolean> { 
    var userFromDb = await this.userModel.findOne({ email: email});
    if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', 404);
    
    userFromDb.password = await bcrypt.hash(newPassword, saltRounds);

    await userFromDb.save();
    return true;
  }

  async updateProfile(profileDto: ProfileDto): Promise<User> {
    let userFromDb = await this.userModel.findOne({ userId: profileDto.userId});
    if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', 404);

    if(profileDto.name) userFromDb.name = profileDto.name;
    if(profileDto.surname) userFromDb.surname = profileDto.surname;
    if(profileDto.phone) userFromDb.phone = profileDto.phone;
    if(profileDto.birthdaydate) userFromDb.birthdaydate = profileDto.birthdaydate;

    if (profileDto.profilepicture) {
      let base64Data = profileDto.profilepicture.replace(/^data:image\/png;base64,/, "");
      let dir = '.../public/users/'+ userFromDb.email;

      let success = await this.writeFile(dir, "profilepic.png", base64Data);
      if (success) {
        userFromDb.photos = userFromDb.photos || { profilePic: new PhotoDto()};
        userFromDb.photos.profilePic = userFromDb.photos.profilePic || new PhotoDto();
        userFromDb.photos.profilePic.date = new Date()
        userFromDb.photos.profilePic.url = '/public/users/' + userFromDb.email + '/profilepic.png';
      }
    }

    await userFromDb.save();
    return userFromDb;

  }

  async writeFile(dir: string, filename: any, encoding: string): Promise<boolean> {
    return new Promise(function (resolve, reject){
      let fs = require('fs');
      if (!fs.existsSync(dir)) {fs.mkdirSync(dir)}
      fs.writeFile(dir, filename, encoding, 'base64', function(err) {
        if (err) reject(err);
        else resolve(true);
      });
    })

  }

  async updateSettings(settingsDto: SettingsDto): Promise<User> {
    var userFromDb = await this.userModel.findOne({ email: settingsDto.email});
    if(!userFromDb) throw new HttpException('COMMON.USER_NOT_FOUND', 404);
    
    userFromDb.settings = userFromDb.settings || {};
    for (var key in settingsDto) {
      if (settingsDto.hasOwnProperty(key) && key != "email") {
        userFromDb.settings[key] = settingsDto[key];
      }
    }
    
    await userFromDb.save();
    return userFromDb;
  }
    
}
