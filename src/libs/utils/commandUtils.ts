import { CoreUtils, MetadataItem, MetadataObject, MetadataType } from '@aurahelper/core';
const Validator = CoreUtils.Validator;
const Utils = CoreUtils.Utils;

export default class CommandUtils {
  public static getPaths(paths: string | string[], root: string, isFolder?: boolean): string[] {
    const result: string[] = [];
    if (!root.endsWith('/') && !root.endsWith('\\')) {
      root += '/';
    }
    const resultTmp: string[] = Utils.forceArray(paths) as string[];
    for (let typeTmp of resultTmp) {
      typeTmp = typeTmp.trim();
      const path = typeTmp.startsWith('./') && typeTmp !== root ? root + typeTmp.substring(2) : typeTmp;
      if (!isFolder) {
        result.push(Validator.validateFilePath(path.trim()));
      } else {
        result.push(Validator.validateFolderPath(path.trim()));
      }
    }
    return result;
  }

  public static getTypes(type: string | string[]): string[] {
    const types: string[] = [];
    const typesTmp: string[] = Utils.forceArray(type) as string[];
    for (const typeTmp of typesTmp) {
      types.push(typeTmp.trim());
    }
    return types;
  }

  public static getAdvanceTypes(type: string | string[]): { [key: string]: MetadataType } {
    const types: { [key: string]: MetadataType } = {};
    const typesTmp: string[] = Utils.forceArray(type) as string[];
    for (const typeTmp of typesTmp) {
      if (typeTmp.indexOf(':') !== -1) {
        const splits = typeTmp.split(':');
        if (splits.length === 2) {
          const metadataType = splits[0].trim();
          const metadataObject = splits[1].trim();
          if (!types[metadataType]) {
            types[metadataType] = new MetadataType(metadataType, false);
          }
          if (!types[metadataType].childs[metadataObject] && metadataObject !== '*') {
            types[metadataType].addChild(new MetadataObject(metadataObject, true));
          }
          if (metadataObject === '*') {
            types[metadataType].checked = true;
          }
        } else if (splits.length === 3) {
          const metadataType = splits[0].trim();
          const metadataObject = splits[1].trim();
          const metadataItem = splits[2].trim();
          if (!types[metadataType]) {
            types[metadataType] = new MetadataType(metadataType, false);
          }
          if (!types[metadataType].childs[metadataObject] && metadataObject !== '*') {
            types[metadataType].addChild(new MetadataObject(metadataObject, false));
          }
          if (!types[metadataType].childs[metadataObject].childs[metadataItem] && metadataItem !== '*') {
            types[metadataType].childs[metadataObject].addChild(new MetadataItem(metadataItem, true));
          }
          if (metadataObject === '*') {
            types[metadataType].checked = true;
          }
          if (metadataItem === '*') {
            types[metadataType].childs[metadataObject].checked = true;
          }
        }
      } else {
        const metadataType = typeTmp.trim();
        types[metadataType] = new MetadataType(metadataType, true);
      }
    }
    return types;
  }
}
