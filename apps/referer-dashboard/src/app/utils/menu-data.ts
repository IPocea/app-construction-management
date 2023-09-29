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
} from '@enums';

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

export function checkMenuData(
  category: string,
  subcategory: string,
  subcategoryTwo?: string
): boolean {
  if ((<any>Object).values(MenuData).includes(category)) {
    const index = (<any>Object).values(MenuData).indexOf(category);
    if ((<any>Object).values(childrenArray[index]).includes(subcategory)) {
      if (subcategoryTwo) {
        const splitedSubsubIndex = (<any>Object)
          .values(childrenArray[index])
          .indexOf(subcategory);
        if (
          (<any>Object)
            .values(splitedGrandchildrenArray[index][splitedSubsubIndex])
            .indexOf(subcategoryTwo) !== -1
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
