import { Routes } from '@nestjs/core';
import { TemplateRouteNameModule } from './sub-route-name/index.module';
// * (nest-route) import - do not remove this comment.

export const TemplateParentRouteNameRoutes: Routes = [
  {
    path: '/sub-route-path',
    module: TemplateRouteNameModule,
  },
  // * (nest-route) define - do not remove this comment.
];
