import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

   const PORT = process.env.PORT;
  await app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}\nDatabase connected successfully`);
  });
}
bootstrap();



