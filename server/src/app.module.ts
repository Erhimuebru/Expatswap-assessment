import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { EmailVerificationService } from './email-verification/email-verification.service';
import { APP_PIPE } from '@nestjs/core';
import { RenderService} from './render-service/render-service.service';
import { ScheduleModule } from '@nestjs/schedule';






@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    ScheduleModule.forRoot(),
    UserModule,
 
  ],
  controllers: [],
  providers: [ EmailVerificationService,   {
    provide: APP_PIPE,
    useClass: ValidationPipe ,
  }, RenderService]
})
export class AppModule {}

