import { Test, TestingModule } from '@nestjs/testing';
import { RenderServiceService } from './render-service.service';

describe('RenderServiceService', () => {
  let service: RenderServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RenderServiceService],
    }).compile();

    service = module.get<RenderServiceService>(RenderServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
