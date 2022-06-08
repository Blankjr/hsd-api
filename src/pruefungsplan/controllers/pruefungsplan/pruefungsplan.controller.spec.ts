import { Test, TestingModule } from '@nestjs/testing';
import { PruefungsplanController } from './pruefungsplan.controller';

describe('PruefungsplanController', () => {
  let controller: PruefungsplanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PruefungsplanController],
    }).compile();

    controller = module.get<PruefungsplanController>(PruefungsplanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
