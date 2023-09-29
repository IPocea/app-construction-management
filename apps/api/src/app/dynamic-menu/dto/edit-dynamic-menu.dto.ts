import { IDynamicMenuIcon } from "../interface";

export class EditDynamicMenuDto {
  name: string;
  key?: string;
  type?: string;
  description?: string;
  icon?: IDynamicMenuIcon;
}