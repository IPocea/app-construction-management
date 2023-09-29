import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AccesTokenGuard } from '../auth/guards/access-token-guard';
import { DynamicMenuNotUsedService } from './dynamic-menu-not-used.service';

@Controller()
export class DynamicMenuNotUsedController {
  constructor(private dynamicMenuService: DynamicMenuNotUsedService) {}

  @UseGuards(AccesTokenGuard)
  @Get(':parent/:child/:nephew?')
  async getSubcategoryOfSubcategory(
    @Param('parent') parent: string,
    @Param('child') child: string,
    @Param('nephew') nephew: string
  ): Promise<{
    parent: string;
    child: string;
    nephew?: string;
  }> {
    return await this.dynamicMenuService.getData(parent, child, nephew);
  }
}
