import { Test, TestingModule } from '@nestjs/testing';
import { UserTokenCheckService } from './index.service';

describe('LegacyService', () => {
  let service: UserTokenCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTokenCheckService],
    }).compile();

    service = module.get<UserTokenCheckService>(UserTokenCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
