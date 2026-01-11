import { Test, TestingModule } from '@nestjs/testing';
import { AiGateway } from './ai.gateway';

describe('AiGateway', () => {
  let gateway: AiGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiGateway],
    }).compile();

    gateway = module.get<AiGateway>(AiGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
