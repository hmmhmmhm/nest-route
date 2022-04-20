import { Test, TestingModule } from '@nestjs/testing';
import { TemplateRouteNameController } from './index.controller';

describe('LegacyController', () => {
  let controller: TemplateRouteNameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateRouteNameController],
    }).compile();

    controller = module.get<TemplateRouteNameController>(
      TemplateRouteNameController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
