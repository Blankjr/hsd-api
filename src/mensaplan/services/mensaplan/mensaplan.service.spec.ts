import { Test, TestingModule } from '@nestjs/testing';
import { MensaplanService } from './mensaplan.service';

describe('MensaplanService', () => {
  let service: MensaplanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MensaplanService],
    }).compile();

    service = module.get<MensaplanService>(MensaplanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
