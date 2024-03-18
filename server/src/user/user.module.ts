// user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './dto/user.schema';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService,  EmailVerificationService, JwtService, ConfigService],
})
export class UserModule {}
