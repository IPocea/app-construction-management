import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BuildingData,
  BuildingFloors,
  BuildingFoundation,
  BuildingFurniture,
  BuildingHydroIsolation,
  BuildingInstallations,
  BuildingRoof,
  BuildingSanitaries,
  BuildingStrucutre,
  BuildingThermicIsolation,
  BuildingWalls,
  BuildingWindows,
  MenuData,
  ExteriorData,
  ExteriorEntertainment,
  ExteriorFunctional,
  ExteriorLayout,
  ExteriorStructure,
  PreparationAuthorisationProcess,
  PreparationAuthorisationProject,
  PreparationData,
  PreparationInstallationProject,
  PreparationStructureProject,
  PreprationArhitectureDesign,
  SuppliersData,
  SuppliersConcrete,
  SuppliersConstruction,
  SuppliersInstallation,
  SuppliersIron,
  SuppliersWalls,
  TeamsData,
  TeamsConstruction,
  TeamsInstallation,
  TeamsIsolation,
} from './enums/dynamic-menu.enum';

@Injectable()
export class DynamicMenuNotUsedService {
  constructor() {}

  async getData(
    parent: string,
    child: string,
    newphew?: string
  ): Promise<{
    parent: string;
    child: string;
    newphew?: string;
  }> {
    const childrenArray = [
      PreparationData,
      BuildingData,
      ExteriorData,
      TeamsData,
      SuppliersData,
    ];
    // it is very important to put the splited arrays in the same order as children array
    // if index 0 is for PreparationData in childrenArray, then index 0 should be in
    // splitedGrandchildrenArray for Preparation
    const splitedGrandchildrenArray = [
      [
        PreprationArhitectureDesign,
        PreparationStructureProject,
        PreparationInstallationProject,
        PreparationAuthorisationProject,
        PreparationAuthorisationProcess,
      ],
      [
        BuildingFoundation,
        BuildingStrucutre,
        BuildingRoof,
        BuildingWindows,
        BuildingInstallations,
        BuildingThermicIsolation,
        BuildingHydroIsolation,
        BuildingWalls,
        BuildingFloors,
        BuildingSanitaries,
        BuildingFurniture,
      ],
      [
        ExteriorStructure,
        ExteriorLayout,
        ExteriorFunctional,
        ExteriorEntertainment,
      ],
      [TeamsConstruction, TeamsInstallation, TeamsIsolation],
      [
        SuppliersIron,
        SuppliersConcrete,
        SuppliersWalls,
        SuppliersConstruction,
        SuppliersInstallation,
      ],
    ];
    if ((<any>Object).values(MenuData).includes(parent)) {
      const index = (<any>Object).values(MenuData).indexOf(parent);
      if ((<any>Object).values(childrenArray[index]).includes(child)) {
        if (newphew) {
          const splitedSubsubIndex = (<any>Object)
            .values(childrenArray[index])
            .indexOf(child);
          if (
            (<any>Object)
              .values(splitedGrandchildrenArray[index][splitedSubsubIndex])
              .indexOf(newphew) !== -1
          ) {
            return {
              parent: parent,
              child: child,
              newphew: newphew,
            };
          } else {
            throw new NotFoundException(
              `There is no subcategory with the name ${newphew} for the category ${child}`
            );
          }
        } else {
          return {
            parent: parent,
            child: child,
          };
        }
      } else {
        throw new NotFoundException(
          `There is no subcategory with the name ${child}`
        );
      }
    } else {
      throw new NotFoundException(
        `There is no category with the name ${parent}`
      );
    }
  }
}
