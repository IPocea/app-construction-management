import { IIcon } from '../interface/icon.interface';

export class CreateMenuDto {
  name: string;
  key: string;
  type: string;
  description: string;
  icon: IIcon;
}
