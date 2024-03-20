import { Request, Controller,Get, Post, Body, BadRequestException, ConflictException, Logger, Param} from '@nestjs/common';
import { CreateDto, Role } from './dto/create-user-dto'
import { UserService } from './user.service';
import { User } from '../user/dto/user.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';





@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  

  constructor(private readonly userService: UserService,
  
  ) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateDto): Promise<User> {
    this.logger.log(
      `Incoming request payload: ${JSON.stringify(createUserDto)}`,
    );
    const existingUser = await this.userService.findUserByEmail(
      createUserDto.email,
    );
    this.logger.log(`Existing user details: ${JSON.stringify(existingUser)}`);

    const existingUserPhone = await this.userService.findUserByPhoneNumber(
      createUserDto.phoneNumber,
    );
    this.logger.log(
      `Existing user details: ${JSON.stringify(existingUserPhone)}`,
    );

    if (existingUser) {
      this.logger.error(
        'User with the same Email Address already exists:',
        createUserDto.email,
      );
      throw new ConflictException(
        'User with the same Email Address already exists',
      );
    }

    if (existingUserPhone) {
      this.logger.error(
        'User with the same Phone Number already exists:',
        createUserDto.phoneNumber,
      );
      throw new ConflictException(
        'User with the same Phone Number already exists',
      );
    }

    if (createUserDto.password !== createUserDto.confirmPassword) {
      this.logger.error('Password and confirmPassword does not match');
      throw new BadRequestException(
        'Password and confirmPassword does not match',
      );
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 15);
    const createdUser = await this.userService.createUser({
      lastName: createUserDto.lastName,
      firstName: createUserDto.firstName,
      password: hashedPassword,
      phoneNumber: createUserDto.phoneNumber,
      email: createUserDto.email,
      dob: createUserDto.dob,
   
    },);

    return createdUser;
  }

  
  @Get('confirm/:userId/:token')
async confirmUser(@Param('userId') userId: string, @Param('token') token: string): Promise<string> {
  try {
    await this.userService.confirmUser(userId, token);
    return 'Account successfully confirmed';
  } catch (error) {
    return 'Invalid token or user not found';
  }
}



@Get('all')
async getAllUsers() {
  const users = await this.userService.getUsers();
  return users; 
}

}



