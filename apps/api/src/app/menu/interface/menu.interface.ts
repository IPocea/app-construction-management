import { IIcon } from './icon.interface';

export interface IMenu {
  _id?: string;
  name: string;
  key: string;
  type: string;
  description: string;
  icon: IIcon;
  __V?: number;
}
