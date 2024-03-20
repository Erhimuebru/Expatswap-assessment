import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { User } from '../user/dto/user.schema';
  import * as jwt from 'jsonwebtoken';
  import * as bcrypt from 'bcryptjs';
  import { EmailVerificationService } from 'src/email-verification/email-verification.service';

  @Injectable()
  export class UserService {
  
    constructor(
      @InjectModel(User.name) private readonly userModel: Model<User>,
      private readonly emailService: EmailVerificationService,
      private configService: ConfigService,
     ) {}
  
  

    async createUser(userData: Partial<User>): Promise<User> {
        try {
          const user = new this.userModel(userData);
          const confirmationToken = jwt.sign({ userId: user._id }, this.configService.get<string>('CONFIRMATION_SECRET_KEY'), { expiresIn: this.configService.get<string>('CONFIRMATION_TOKEN_EXPIRATION') });;
          user.confirmationToken = confirmationToken;
          const createdUser = await user.save();
          
          const confirmationLink = `${this.configService.get('CONFIRMATION_BASE_URL')}/users/confirm/${createdUser._id}/${confirmationToken}`;
          await this.emailService.sendConfirmationEmail(user.email, confirmationLink);
          
          console.log("user",confirmationLink)
          return createdUser;
        } catch (error) {
          if (error.code === 11000) {
            throw new ConflictException('User with the same phone number or email already exists');
          }
          throw error;
        }
    }


    async findUserByPhoneNumber(phoneNumber: string): Promise<User> {
      const user = await this.userModel.findOne({ phoneNumber }).exec();
      return user;
    }
  
    async findUserByEmail(email: string): Promise<User> {
      const user = await this.userModel.findOne({ email }).exec();
      return user;
    }
  
  
    async confirmUser(userId: string, token: string): Promise<void> {
      try {
        const decoded: any = jwt.verify(token, this.configService.get<string>('CONFIRMATION_SECRET-KEY'));
        if (decoded && decoded.userId === userId) {
          await this.userModel.updateOne(
            { _id: userId },
            { isConfirmed: true, confirmationToken: null },
          );
        } else {
          throw new BadRequestException('Invalid token');
        }
      } catch (error) {
        throw new BadRequestException('Invalid token');
      }
    }
  

  
   
    async validateUser(email: string, password: string): Promise<any> {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('Invalid email');
      }
      if (!user.isConfirmed) {
  
  
      }
    }




    async getUsers() {
        try {
          const users = await this.userModel
            .find({}, 'firstName lastName dob email phoneNumber createdAt')
            .sort({ createdAt: -1 })
            .lean()
    
            .exec();
    
          return users.map((usersCard) => ({
            id: usersCard._id,
            firstName: usersCard.firstName,
            lastName: usersCard.lastName,
            dob: usersCard.dob,
            email: usersCard.email,
           phoneNumber: usersCard.phoneNumber,
            createdAt: usersCard.createdAt,
           
          }));
        } catch (error) {
          console.error('Error fetching Post cards:', error);
          throw error;
        }
      }
 
  }

  