import { Module } from '@nestjs/common';
import { TemplateRouteNameController } from './index.controller';
import { TemplateRouteNameService } from './index.service';

@Module({
  controllers: [TemplateRouteNameController],
  providers: [TemplateRouteNameService],
})
export class TemplateRouteNameModule {}
