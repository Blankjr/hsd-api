import { Test, TestingModule } from '@nestjs/testing';
import { MensaplanController } from './mensaplan.controller';

describe('MensaplanController', () => {
  let controller: MensaplanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MensaplanController],
    }).compile();

    controller = module.get<MensaplanController>(MensaplanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
