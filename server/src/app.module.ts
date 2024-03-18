import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { EmailVerificationService } from './email-verification/email-verification.service';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
// import { PasswordValidator } from './user/dto/password.validator';






@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    UserModule,
 
  ],
  controllers: [],
  providers: [ EmailVerificationService,   {
    provide: APP_PIPE,
    useClass: ValidationPipe ,
  }]
})
export class AppModule {}

