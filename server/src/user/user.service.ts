import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
      private jwtService: JwtService,
     ) {}
  
  
 
    // async createUser(userData: Partial<User>): Promise<User> {
    //   try {
    //     const user = new this.userModel(userData);
  
    //     // Generate confirmation token
    //     const confirmationToken = jwt.sign({ userId: user._id }, 'yourConfirmationSecretKey', { expiresIn: '1d' });
  
    //     // Store confirmation token in the user document
    //     user.confirmationToken = confirmationToken;
  
    //     const createdUser = await user.save();
       
    //     const confirmationLink = `https://9ja-update.vercel.app/users/confirm/${createdUser._id}/${confirmationToken}`;
        
    //     // const confirmationLink = `http://localhost:5173/users/confirm/${createdUser._id}/${confirmationToken}`;
    //     await this.emailService.sendConfirmationEmail(user.email, confirmationLink);
    //     console.log("user",confirmationLink)
    //     return createdUser;
    //   } catch (error) {
    //     if (error.code === 11000) {
    //       throw new ConflictException('User with the same phone number or email already exists');
    //     }
    //     throw error;
    //   }
    // }


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
  
    async storeResetToken(userId: string, resetToken: string): Promise<void> {
      await this.userModel.updateOne({ _id: userId }, { resetToken });
    }
  
    async confirmUser(userId: string, token: string): Promise<void> {
      try {
        // Verify the token
        const decoded: any = jwt.verify(token, 'yourConfirmationSecretKey');
  
        // Ensure the decoded user ID matches the provided user ID
        if (decoded && decoded.userId === userId) {
          // Update the user's status to indicate that the account has been confirmed
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
  
    async forgotPassword(email: string): Promise<string> {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      // Generate and save a reset token for the user
       const resetToken = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });
       await this.userModel.updateOne({ _id: user._id }, { resetToken });
  
      return resetToken;
    }
  
    async resetPassword(resetToken: string, newPassword: string): Promise<void> {
      try {
        const decoded: any = jwt.verify(resetToken, 'yourSecretKey');
  
        if (!decoded || !decoded.userId) {
          throw new BadRequestException('Invalid reset token');
        }
  
        const hashedPassword = await bcrypt.hash(newPassword, 10);
  
        await this.userModel.updateOne(
          { _id: decoded.userId },
          { password: hashedPassword, resetToken: null }
        );
      } catch (error) {
        throw new BadRequestException('Invalid reset token');
      }
    }
  
  
    async updateUserPassword(userId: string, newPassword: string): Promise<void> {
      try {
        // Find the user by ID and update the password field
        await this.userModel.updateOne({ _id: userId }, { password: newPassword });
      } catch (error) {
        // Handle any errors that may occur during the update process
        throw new Error('Failed to update user password');
      }
    }
   
    async validateUser(email: string, password: string): Promise<any> {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('Invalid email');
      }
      if (!user.isConfirmed) {
  
  
      }
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid password');
      }
      const { password: _, ...result } = user.toObject();
      return result;
    }

 
  }

  