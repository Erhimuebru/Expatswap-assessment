import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class RenderService {
  private readonly logger = new Logger(RenderService.name);

  constructor() {}

  @Interval(2000) 
  async triggerEndpoint() {
    try {
      const response = await axios.get('https://expatswap-assessment.onrender.com/users/all');
      console.log(response)
    } catch (error) {
      this.logger.error(`Error triggering endpoint: ${error.message}`);
    }
  }
}
